# AI disclosure: written with AI assistance (Anthropic Claude, via Claude Code); reviewed and edited by the DECO team.
# js/crops.js dosyasını FAO ECOCROP tablosundan üretir.
#
# Kullanım (field-shift klasöründe):
#     python tools/build_crops.py                 js/crops.js'i yeniden üretir
#     python tools/build_crops.py --ara "Zea mays"   tabloda ad arar (doğru CODE'u bulmak için)
#
# Girdi 1: tools/ecocrop.rds  -> Recocrop R paketindeki ECOCROP tablosu (1710 kayıt).
#          Dosya yoksa betik onu Recocrop'un GitHub deposundan indirir. Bu dosya depoya ve
#          yayımlanan siteye konmaz (.gitignore'da); her bilgisayarda betik kendisi indirir.
# Girdi 2: tools/urunler.json -> ekibin doldurduğu dosya (hangi ürünler, adlar, grup, dona dayanıklılık).
# Çıktı:   js/crops.js        -> elle DEĞİŞTİRMEYİN; her çalıştırmada baştan yazılır.
#
# Yalnızca Python'un kendi kütüphanelerini kullanır; kurulum gerekmez.

import gzip
import json
import struct
import sys
import urllib.request
from pathlib import Path

TOOLS = Path(__file__).resolve().parent
RDS = TOOLS / "ecocrop.rds"
TEAM = TOOLS / "urunler.json"
OUT = TOOLS.parent / "js" / "crops.js"
RDS_URL = "https://raw.githubusercontent.com/cropmodels/Recocrop/master/inst/parameters/ecocrop.rds"
SOURCE = "FAO ECOCROP, Recocrop R paketi üzerinden (inst/parameters/ecocrop.rds)"
FIELDS = ("GMIN", "GMAX", "KTMP", "TMIN", "TOPMN", "TOPMX", "TMAX", "RMIN", "ROPMN", "ROPMX", "RMAX")


# ---------- R'nin .rds dosyasını okuma (yalnızca bu tablonun kullandığı veri türleri) ----------
def read_rds(path):
    data = gzip.decompress(path.read_bytes())
    if data[:2] != b"X\n":
        raise SystemExit("ecocrop.rds beklenen biçimde değil.")
    pos = 2
    refs = []
    NA_INT = -2147483648

    def i32():
        nonlocal pos
        v = struct.unpack_from(">i", data, pos)[0]
        pos += 4
        return v

    def item():
        nonlocal pos
        flags = i32()
        kind, has_attr, has_tag = flags & 0xFF, bool(flags & 0x200), bool(flags & 0x400)
        if kind == 254:                      # NULL
            return None
        if kind == 255:                      # daha önce okunmuş bir ada gönderme
            return refs[(flags >> 8 or i32()) - 1]
        if kind == 1:                        # ad (symbol)
            refs.append(item())
            return refs[-1]
        if kind == 2:                        # ad-değer listesi (özellikler)
            pairs = []
            while True:
                if has_attr:
                    item()
                tag = item() if has_tag else None
                pairs.append((tag, item()))
                flags = i32()
                if flags & 0xFF == 254:
                    return pairs
                has_attr, has_tag = bool(flags & 0x200), bool(flags & 0x400)
        if kind == 9:                        # tek bir metin
            n = i32()
            if n == -1:
                return None
            raw = data[pos:pos + n]
            pos += n
            try:
                return raw.decode("utf-8")
            except UnicodeDecodeError:
                return raw.decode("latin-1")
        n = i32()
        if kind in (10, 13):                 # tam sayılar
            values = [None if v == NA_INT else v for v in struct.unpack_from(f">{n}i", data, pos)]
            pos += 4 * n
        elif kind == 14:                     # ondalıklı sayılar
            values = [None if v != v else v for v in struct.unpack_from(f">{n}d", data, pos)]
            pos += 8 * n
        elif kind in (16, 19):               # metin sütunu / liste
            values = [item() for _ in range(n)]
        else:
            raise SystemExit(f"ecocrop.rds içinde beklenmeyen veri türü: {kind}")
        attrs = dict(item()) if has_attr else {}
        return {"values": values, "attrs": attrs}

    version = i32()
    i32()
    i32()
    if version >= 3:
        name_length = i32()   # kodlama adı (ör. "UTF-8") atlanır
        pos += name_length
    table = item()
    names = table["attrs"]["names"]["values"]
    columns = {}
    for name, col in zip(names, table["values"]):
        values = col["values"]
        if "levels" in col["attrs"]:         # kategorik sütun: sayıları adlara çevir
            levels = col["attrs"]["levels"]["values"]
            values = [None if v is None else levels[v - 1] for v in values]
        columns[name] = values
    count = len(columns[names[0]])
    return [{name: columns[name][i] for name in names} for i in range(count)]


def load_table():
    if not RDS.exists():
        print("tools/ecocrop.rds yok, indiriliyor:", RDS_URL)
        urllib.request.urlretrieve(RDS_URL, RDS)
    rows = read_rds(RDS)
    if len(rows) < 1000 or "TOPMN" not in rows[0]:
        raise SystemExit("ECOCROP tablosu beklenen gibi okunamadı.")
    return rows


def num(v):
    """Tam sayıya eşit ondalıkları tam sayı yapar (20.0 -> 20)."""
    return int(v) if isinstance(v, float) and v == int(v) else v


WATER_SOURCE = "FAO Irrigation Water Management Training Manual No. 3 (1986), Table 14"


def water_need(team):
    """urunler.json'daki FAO su ihtiyacını {min, max, ...} biçimine çevirir; yoksa None."""
    w = team.get("faoSuIhtiyaci")
    if not w:
        return None
    lo, hi = (int(x) for x in w["mm"].split("-"))
    return {"min": lo, "max": hi, "droughtSensitivity": w["kurakligaDuyarlilik"], "faoRow": w["satir"], "source": WATER_SOURCE}


# ---------- Bir ürünün kaydını kurma ve otomatik kontroller ----------
def build_crop(team, row):
    auto = []  # betiğin kendiliğinden eklediği uyarılar
    g = {k: num(row[k]) for k in FIELDS}

    # Ekibin elle düzeltmeleri (urunler.json "duzeltme"): tablodaki sayının yerine geçer, gerekçesiyle nota yazılır
    corrections = []
    for field, fix in (team.get("duzeltme") or {}).items():
        if field not in FIELDS:
            raise SystemExit(f"{team['id']}: düzeltilecek alan '{field}' tanınmıyor. Geçerli alanlar: {', '.join(FIELDS)}")
        if not isinstance(fix, dict) or not isinstance(fix.get("deger"), (int, float)) or not str(fix.get("gerekce", "")).strip():
            raise SystemExit(f"{team['id']}: '{field}' düzeltmesinde sayı olarak 'deger' ve boş olmayan 'gerekce' gerekli.")
        corrections.append({"field": field, "table": g[field], "value": num(fix["deger"]), "reason": fix["gerekce"].strip()})
        auto.append(f"DÜZELTME (ekip): {field} tabloda {g[field]}, {num(fix['deger'])} olarak düzeltildi. Gerekçe: {fix['gerekce'].strip()}")
        g[field] = num(fix["deger"])
    ktmp_corrected = any(c["field"] == "KTMP" for c in corrections)

    ktmp, frost_hardy, frost_source = g["KTMP"], None, "ecocrop"
    if ktmp_corrected:
        frost_source = "team"  # ekip gerçek bir değer verdi; 0 olsa bile kullanılır
    elif ktmp in (0, None):
        # Tablodaki 0 muhtemelen gerçek veri değil, varsayılan değer: kullanılmaz, ekibin bilgisi kullanılır
        ktmp, frost_hardy, frost_source = None, team.get("donaDayanikli"), "team"
        if frost_hardy is None:
            frost_source = None
            auto.append("EKSİK: KTMP tabloda 0 ve urunler.json'da donaDayanikli boş.")
        else:
            auto.append("KTMP tabloda 0 (muhtemelen varsayılan); dona dayanıklılık bilgisi ECOCROP'tan değil EKİPTEN.")
    elif team.get("donaDayanikli") is not None and team.get("kislikEkilebilir"):
        # Ekip kararı (14 Kasım 2026): kışlık ekilebilen ürünlerde don için tablodaki tek KTMP değeri yerine
        # ekibin bilgisi kullanılır. KTMP kayıtta durur ama hesapta kullanılmaz.
        frost_hardy, frost_source = team["donaDayanikli"], "team"
        auto.append(f"Kışlık ekilebilen ürün: don için ECOCROP'un KTMP değeri ({ktmp}°C) yerine EKİBİN dona dayanıklılık bilgisi kullanılıyor.")
    elif team.get("donaDayanikli") is not None:
        auto.append("urunler.json'daki donaDayanikli kullanılmadı: tabloda gerçek bir KTMP değeri var ve ürün kışlık değil.")

    if not (g["TMIN"] <= g["TOPMN"] <= g["TOPMX"] <= g["TMAX"]):
        auto.append("TUTARSIZ: sıcaklık sınırları sırayla artmıyor.")
    if not (g["RMIN"] <= g["ROPMN"] <= g["ROPMX"] <= g["RMAX"]):
        auto.append("TUTARSIZ: yağış sınırları sırayla artmıyor.")
    if g["GMIN"] > g["GMAX"]:
        auto.append("TUTARSIZ: en kısa yetişme süresi en uzundan büyük.")
    if g["GMAX"] - g["GMIN"] >= 180:
        auto.append(f"Yetişme süresi {g['GMIN']}–{g['GMAX']} gün: çok geniş.")

    family = (row["FAMNAME"] or "").strip()
    note = " ".join(p for p in [team.get("not", "").strip(), *auto] if p)
    return {
        "id": team["id"],
        "name": team["ad"],
        "scientific": team["bilimselAd"],
        "family": family,
        "group": team["grup"],
        "legume": family.lower() == "leguminosae",
        "ecocrop": {"name": row["NAME"].strip(), "scientific": row["SCIENTNAME"].strip(), "code": num(row["CODE"])},
        "gmin": g["GMIN"], "gmax": g["GMAX"],
        "ktmp": ktmp, "frostHardy": frost_hardy, "frostSource": frost_source,
        "tmin": g["TMIN"], "topmn": g["TOPMN"], "topmx": g["TOPMX"], "tmax": g["TMAX"],
        "rmin": g["RMIN"], "ropmn": g["ROPMN"], "ropmx": g["ROPMX"], "rmax": g["RMAX"],
        "winterCrop": bool(team.get("kislikEkilebilir")),
        "longCycle": bool(team.get("uzunSureli")),
        "corrections": corrections,
        # Aşama 3: tarlada kalma süreleri (ekipten / FAO el kitabından öneri) ve FAO su ihtiyacı
        "typicalMonths": team.get("tipikSureAy"),
        "typicalMonthsApproved": bool(team.get("tipikSureOnay")),
        "winterMonths": team.get("kislikSureAy") if team.get("kislikEkilebilir") else None,
        "waterNeed": water_need(team),
        "rootDepth": None,
        "check": note,
    }


HEADER = """// AI disclosure: written with AI assistance (Anthropic Claude, via Claude Code); reviewed and edited by the DECO team.
// Generated from FAO ECOCROP (Recocrop) by an AI-assisted script.
// BU DOSYA OTOMATİK ÜRETİLİR — elle değiştirmeyin.
// Üreten betik: tools/build_crops.py   Ekibin doldurduğu dosya: tools/urunler.json
// Değişiklik için urunler.json'u düzenleyip şu komutu çalıştırın:  python tools/build_crops.py
//
// Kaynak: {source}; {count} ürün.
// Sayılar tablodan olduğu gibi alınır. Ekip bir sayıyı düzelttiyse (urunler.json "duzeltme"),
// tablodaki değer, yeni değer ve gerekçe o ürünün "corrections" ve "check" alanlarında yazar.
//
// Alanlar:
//   ecocrop                   tablodaki özgün ad, bilimsel ad ve CODE numarası (kaydı tekrar bulmak için)
//   gmin, gmax                yetişme süresi, gün (GMIN, GMAX)
//   ktmp                      öldürücü sıcaklık, °C (KTMP). Tabloda 0 ise muhtemelen varsayılan değerdir;
//                             o zaman ktmp null yazılır ve frostHardy kullanılır.
//   frostHardy                dona dayanıklı mı (true/false), EKİPTEN. ktmp null olan ürünlerde ve kışlık
//                             ekilebilen ürünlerde dolu; kışlık ürünlerde ktmp yazsa bile hesapta bu kullanılır.
//   frostSource               hesapta kullanılan don bilgisinin kaynağı: "ecocrop" (ktmp) ya da "team" (frostHardy)
//   tmin, topmn, topmx, tmax  sıcaklık: dayanma alt sınırı, en iyi aralık, dayanma üst sınırı (°C)
//   rmin, ropmn, ropmx, rmax  YILLIK yağış: alt sınır, en iyi aralık, üst sınır (mm). FAO tanımı yıllıktır.
//   legume                    tablodaki aile adı (FAMNAME) Leguminosae ise true
//   group, name               ECOCROP'tan değil, ekipten (urunler.json)
//   winterCrop                true ise kışlık ekilebilir (EKİPTEN): soğuk ama öldürücü olmayan aylar "kış beklemesi" sayılır
//   longCycle                 true ise ürün tarlada bir yıla yakın ya da daha uzun kalabilir
//   typicalMonths             tarlada kaldığı tipik süre (ay); typicalMonthsApproved false ise ÖNERİ/TASLAKTIR
//   winterMonths              kışlık ekimde tarlada kaldığı süre (ay); yalnızca kışlık ürünlerde, ekipten
//   waterNeed                 FAO sulama el kitabındaki su ihtiyacı (mm, tüm yetişme dönemi); 8 üründe yok (null).
//                             Puana girmez; kartta kanıt olarak gösterilir.
//   rootDepth                 ECOCROP'ta yok; Aşama 4 için ayrıldı, şimdilik boş
//   check                     ekibin notları ve betiğin otomatik uyarıları

const CROP_SOURCE = "FAO ECOCROP (via the Recocrop package)";

const CROPS = """


def main():
    rows = load_table()

    if len(sys.argv) > 2 and sys.argv[1] == "--ara":
        needle = sys.argv[2].lower()
        for r in rows:
            if needle in (r["NAME"] or "").lower() or needle in (r["SCIENTNAME"] or "").lower():
                print(f"CODE {num(r['CODE']):>5}  {r['NAME']}  |  {r['SCIENTNAME']}  |  gün {num(r['GMIN'])}–{num(r['GMAX'])}"
                      f"  KTMP {num(r['KTMP'])}  sıcaklık {num(r['TMIN'])}/{num(r['TOPMN'])}–{num(r['TOPMX'])}/{num(r['TMAX'])}"
                      f"  yağış {num(r['RMIN'])}/{num(r['ROPMN'])}–{num(r['ROPMX'])}/{num(r['RMAX'])}")
        return

    by_code = {}
    for r in rows:
        by_code.setdefault(num(r["CODE"]), []).append(r)

    team = json.loads(TEAM.read_text(encoding="utf-8"))["urunler"]
    crops, seen = [], set()
    for t in team:
        if t["id"] in seen:
            raise SystemExit(f"urunler.json: '{t['id']}' iki kez yazılmış.")
        seen.add(t["id"])
        matches = by_code.get(t["ecocropCode"], [])
        if len(matches) != 1:
            raise SystemExit(f"{t['id']}: tabloda CODE {t['ecocropCode']} için {len(matches)} satır bulundu (1 olmalı).")
        row = matches[0]
        if not row["SCIENTNAME"].lower().startswith(t["bilimselAd"].lower()):
            raise SystemExit(f"{t['id']}: CODE {t['ecocropCode']} tabloda '{row['SCIENTNAME']}'; beklenen '{t['bilimselAd']}'. Yanlış satır mı?")
        if t["grup"] not in ("cereal", "legume", "oilseed", "root"):
            raise SystemExit(f"{t['id']}: grup '{t['grup']}' tanınmıyor.")
        if not t["ad"].get("en") or not t["ad"].get("tr"):
            raise SystemExit(f"{t['id']}: TR ve EN ad ikisi de gerekli.")
        crops.append(build_crop(t, row))

    body = json.dumps(crops, ensure_ascii=False, indent=2)
    OUT.write_text(HEADER.format(source=SOURCE, count=len(crops)) + body + ";\n", encoding="utf-8", newline="\n")

    print(f"{OUT.relative_to(TOOLS.parent)} yazıldı: {len(crops)} ürün.")
    for c in crops:
        origin = "ECOCROP" if c["frostSource"] == "ecocrop" else "ekip düzeltmesi"
        frost = f"dona dayanıklı: {c['frostHardy']} (ekip)" if c["frostHardy"] is not None else f"KTMP {c['ktmp']}°C ({origin})"
        print(f"  {c['id']:<12} CODE {c['ecocrop']['code']:<5} {c['ecocrop']['name']:<26} {frost}")
    problems = [c for c in crops if "TUTARSIZ" in c["check"] or "EKSİK" in c["check"]]
    for c in problems:
        print(f"  !! {c['id']}: {c['check']}")
    if not problems:
        print("Tutarsız ya da eksik kayıt yok.")


if __name__ == "__main__":
    main()
