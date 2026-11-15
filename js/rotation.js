// Aşama 3: rotasyon karşılaştırma motoru.
// Kural tabanlıdır; yapay zeka ya da tahmin modeli değildir. Kurallar ve ağırlıklar ekip kararıdır (14 Kasım 2026):
//  - Altı ölçüt, her biri 1–5: iklim uyumu, su, azot katkısı, toprak örtüsü, zararlı döngüsü, satılabilirlik.
//  - Alternatifler çiftçinin rotasyonuna TEK hamle uygulanarak üretilir (boşluğu doldur ya da bir ürünü değiştir).
//  - Alternatifler nadas eklemez. Örtü bitkisi rotasyona eklenmez; yalnızca kartta not olarak önerilir.
// Bu dosya yalnızca hesap yapar; ekrana çizim js/cards.js'tedir.

const FALLOW = "fallow"; // "Nadas (boş yıl)": ürün listesindeki özel seçenek; 12 ay ürünsüz sayılır

// "Diğer": listede olmayan ürün. Çiftçi adını yazar, ekim ve hasat ayını seçer. Verimiz olmadığı için iklim ve su
// puanı hesaplanmaz (kartta bilgi boşluğu olarak yazılır); takvimde, ürünsüz ay hesabında ve toprak örtüsü puanında
// yer alır; zararlı döngüsünde farklı bir aile sayılır. Motor "Diğer"i hiçbir zaman öneri olarak getirmez.
const OTHER = "other";

const Rotation = {
  // "Diğer" dönemi için ürün kaydı: adı çiftçinin yazdığı addır; ailesi kendine özgüdür (aynı ad = aynı ürün)
  otherCrop(p) {
    const name = (p.name || "").trim() || t("otherDefault");
    const key = `${OTHER}:${name.toLocaleLowerCase(LANG)}`;
    return { id: key, other: true, name: { tr: name, en: name }, family: key, legume: false };
  },

  isComplete(p) {
    return p.crop === FALLOW || Boolean(p.crop && p.sow && p.harvest);
  },

  // Dönemleri takvime dizer. Aylar "ilk yılın Ocak ayı = 0" diye sayılır.
  // Her ekim, bir önceki hasattan sonraki ilk uygun aya düşer (hasat ayında ekim olabilir); nadas 12 ay sürer.
  // Döngü, tam yıla yuvarlanır; döngü başa sararken son hasat ayı = ilk ekim ayı ise o ay bir kez sayılır.
  // Dönen değer: { rows, segs, first, months, occupied, bare }
  timeline(periods) {
    const rows = periods.filter(p => this.isComplete(p));
    const firstCrop = rows.findIndex(p => p.crop !== FALLOW);
    if (firstCrop < 0) return null; // yalnızca nadas: rotasyon sayılmaz
    const ordered = rows.slice(firstCrop).concat(rows.slice(0, firstCrop)); // döngü bir üründen başlasın
    const segs = [];
    let cursor = null;
    ordered.forEach(p => {
      if (p.crop === FALLOW) {
        segs.push({ fallow: true, start: cursor + 1, end: cursor + 12 });
        cursor += 12;
        return;
      }
      let start = p.sow - 1;
      if (cursor !== null) while (start < cursor) start += 12;
      const end = start + ((p.harvest - p.sow + 12) % 12);
      segs.push({ fallow: false, crop: p.crop === OTHER ? this.otherCrop(p) : CROPS.find(c => c.id === p.crop), period: p, start, end });
      cursor = end;
    });
    const first = segs[0].start;
    // Döngü başa sararken ortak ay (ekip kararı, 15 Kasım 2026): son ürünün hasat ayı ilk ürünün ekim ayına
    // denk geliyorsa o ay BİR KEZ sayılır ("hasat ayında ekim olabilir" kuralı döngünün sonunda da geçerlidir).
    // Böylece aynı döngü hangi üründen başlanarak yazılırsa yazılsın aynı uzunlukta çıkar
    // (örnek: Çeltik Haz–Eki → Buğday Eki–Haz = 12 ay, ürünsüz ay yok; eskiden 24 ay sayılıyordu).
    const last = segs[segs.length - 1];
    const shared = !last.fallow && cursor > first && (cursor - first) % 12 === 0;
    const months = Math.ceil((cursor - first + (shared ? 0 : 1)) / 12) * 12;
    const occupied = new Set();
    // (ortak ay döngünün başında sayıldığı için sondaki tekrarı döngünün dışında kalır ve eklenmez)
    segs.forEach(s => { if (!s.fallow) for (let m = s.start; m <= s.end && m < first + months; m++) occupied.add(m); });
    return { rows: ordered, segs, first, months, occupied, bare: months - occupied.size };
  },

  // Art arda ürünsüz ayların kümeleri (döngü başa sarar). [{ start, length }]
  bareRuns(tl) {
    const flags = Array.from({ length: tl.months }, (_, i) => !tl.occupied.has(tl.first + i));
    if (!flags.some(Boolean)) return [];
    const runs = [];
    const begin = flags.findIndex((f, i) => f && !flags[(i + tl.months - 1) % tl.months]);
    for (let n = 0; n < tl.months; n++) {
      const i = (begin + n) % tl.months;
      if (!flags[i]) continue;
      if (!flags[(i + tl.months - 1) % tl.months]) runs.push({ start: tl.first + i, length: 1 });
      else runs[runs.length - 1].length++;
    }
    return runs;
  },

  // ---------- Ölçütler ----------
  // Su: yerin yıllık yağışı ürünün ECOCROP aralığının neresinde. Sulama varsa az yağış daha az puan kırar.
  waterScore(crop, rain, water) {
    let s;
    if (rain < crop.rmin) s = 1;
    else if (rain < crop.ropmn) s = 2 + (2 * (rain - crop.rmin)) / Math.max(1, crop.ropmn - crop.rmin);
    else if (rain <= crop.ropmx) s = 5;
    else if (rain <= crop.rmax) s = 4;
    else s = 2;
    if (rain < crop.ropmn) {
      if (water === "irrigated") s += (5 - s) / 2;
      else if (water === "limited") s += (5 - s) / 3;
    }
    return s;
  },

  // ctx: { d (iklim verisi), rain (yıllık mm), water, slope, sell [ürün kısa adları], prio { water, soil, income } }
  evaluate(periods, ctx) {
    const tl = this.timeline(periods);
    if (!tl) return null;
    const crops = tl.segs.filter(s => !s.fallow);
    const known = crops.filter(s => !s.crop.other); // "Diğer" ürünlerin verisi yok: iklim, su ve satılabilirlik bunlarla hesaplanır
    const avg = a => a.reduce((x, y) => x + y, 0) / a.length;

    // 1. İklim uyumu: uygun 1, sınırda yarım, uygun değil 0; kış beklemesi ayları sayılmaz.
    //    Hasat ayı da puanda nötrdür (ekip kararı): hasada gelmiş ürün için o ayın havası belirleyici değil.
    //    s.status bütün ayları sayar (risk cümleleri ve hamle geçerliliği için); counts yalnızca puana girenleri.
    const counts = { good: 0, edge: 0, wait: 0, bad: 0 };
    crops.forEach(s => {
      s.status = { good: 0, edge: 0, wait: 0, bad: 0 };
      s.badBeforeHarvest = 0; // hasat ayı dışındaki "uygun değil" aylar (risk cümlesi puanla tutarlı olsun diye)
      if (s.crop.other) return; // verisi olmayan ürünün ayları değerlendirilemez
      const months = Calendar.cropMonths(s.crop, ctx.d);
      for (let m = s.start; m <= s.end; m++) {
        const st = months[m % 12].status;
        s.status[st]++;
        if (m !== s.end || s.start === s.end) {
          counts[st]++;
          if (st === "bad") s.badBeforeHarvest++;
        }
      }
    });
    const counted = counts.good + counts.edge + counts.bad;
    // Rotasyonda verisi olan hiç ürün yoksa iklim uyumu hesaplanamaz (null) ve toplama girmez
    const climate = !known.length ? null : counted ? 1 + (4 * (counts.good + counts.edge / 2)) / counted : 3;

    // 2. Su (puan yıllık yağışa bakar). Ayrıca ürün tarladayken düşen yağış da hesaplanır (rainIn):
    //    puana girmez; kuru tarımda mevsim kontrolünde kullanılır (seasonTooDry).
    crops.forEach(s => {
      s.water = s.crop.other ? null : this.waterScore(s.crop, ctx.rain, ctx.water);
      s.rainIn = 0;
      for (let m = s.start; m <= s.end; m++) s.rainIn += ctx.d.monthRain[m % 12];
      // Tarladaki ilk iki ayda düşen yağış (ürün tek ay kalıyorsa o ay): kuru mevsime ekim kontrolü için
      s.rainStart = ctx.d.monthRain[s.start % 12] + (s.end > s.start ? ctx.d.monthRain[(s.start + 1) % 12] : 0);
    });
    const water = known.length ? avg(known.map(s => s.water)) : null;

    // 3. Azot katkısı: ürünlerin ne kadarı baklagil
    const legumeShare = crops.filter(s => s.crop.legume).length / crops.length;
    const nitrogen = legumeShare === 0 ? 1 : legumeShare < 1 / 3 ? 3 : legumeShare < 1 / 2 ? 4 : 5;

    // 4. Toprak örtüsü: yağmurun ne kadarı çıplak toprağa düşüyor (NASA POWER aylık yağışı); eğim ±1
    let rainAll = 0, rainBare = 0;
    for (let m = tl.first; m < tl.first + tl.months; m++) {
      rainAll += ctx.d.monthRain[m % 12];
      if (!tl.occupied.has(m)) rainBare += ctx.d.monthRain[m % 12];
    }
    const bareShare = rainAll > 0 ? rainBare / rainAll : 0;
    let cover = bareShare <= 0.15 ? 5 : bareShare <= 0.3 ? 4 : bareShare <= 0.5 ? 3 : bareShare <= 0.7 ? 2 : 1;
    if (ctx.slope === "steep") cover -= 1;
    if (ctx.slope === "flat") cover += 1;
    cover = Math.max(1, Math.min(5, cover));

    // 5. Zararlı döngüsü: art arda gelenlerin kaçı farklı aileden. Nadas farklı bir ürün gibi sayılır.
    //    Üçten az farklı ürün varsa en çok 4 (FAO Koruyucu Tarım: "en az üç farklı ürün").
    const key = s => (s.fallow ? FALLOW : s.crop.family);
    const samePairs = []; // risk cümlesi için; aynı çift (A–B ve B–A) bir kez yazılır
    tl.segs.forEach((s, i) => {
      const next = tl.segs[(i + 1) % tl.segs.length];
      if (key(s) !== key(next) || s.fallow) return;
      const seen = samePairs.some(([a, b]) => (a === s.crop && b === next.crop) || (a === next.crop && b === s.crop));
      if (!seen) samePairs.push([s.crop, next.crop]);
    });
    const sameCount = tl.segs.filter((s, i) => key(s) === key(tl.segs[(i + 1) % tl.segs.length])).length;
    const different = 1 - sameCount / tl.segs.length;
    let pest = different === 1 ? 5 : different >= 0.75 ? 4 : different >= 0.5 ? 3 : different > 0 ? 2 : 1;
    const distinctCrops = new Set(crops.map(s => s.crop.id)).size;
    if (distinctCrops < 3) pest = Math.min(pest, 4);

    // 6. Satılabilirlik: ürünlerin kaçı çiftçinin "kolay satarım" listesinde. Liste boşsa hesaplanmaz.
    //    "Diğer" ürünler hesaba girmez (kolay satılanlar listesinde sorulamıyor).
    const sell = ctx.sell.length && known.length ? 1 + (4 * known.filter(s => ctx.sell.includes(s.crop.id)).length) / known.length : null;

    // Toplam: iklim sabit 3 ağırlık; su, toprak (üç ölçütün ortalaması) ve satılabilirlik kaydırıcı kadar
    const soil = (nitrogen + cover + pest) / 3;
    let sum = ctx.prio.soil * soil, weight = ctx.prio.soil;
    if (climate !== null) { sum += 3 * climate; weight += 3; }
    if (water !== null) { sum += ctx.prio.water * water; weight += ctx.prio.water; }
    if (sell !== null) { sum += ctx.prio.income * sell; weight += ctx.prio.income; }

    const runs = this.bareRuns(tl);
    return {
      tl, crops,
      scores: { climate, water, nitrogen, cover, pest, sell },
      soil, total: sum / weight,
      detail: {
        counts, bareShare, legumeShare, samePairs, distinctCrops,
        others: [...new Set(crops.filter(s => s.crop.other).map(s => s.crop.name[LANG]))], // verisi olmayan ürünlerin adları
        longestBare: runs.reduce((a, r) => Math.max(a, r.length), 0)
      }
    };
  },

  // Yağışın mevsimi (ekip kararı): kuru tarımda, ürün tarladayken düşen yağış ürünün en az YILLIK
  // ihtiyacının üçte birinden azsa "mevsim fazla kuru" sayılır. Alternatiflerde böyle ürün aday olmaz;
  // çiftçinin kendi ürününde yalnızca risk cümlesi çıkar.
  // Eşik neden gevşek: kışı yağışlı iklimlerde ilkbaharda ekilen ürünler kışın toprakta biriken suyu da
  // kullanır; model toprakta biriken suyu hesaplamaz. Eşik ekibin seçimidir, bir kaynaktan gelmez;
  // Konya ve Jamaika örnekleriyle sınanmıştır (yarısı iken Konya'da nohudu da eliyordu).
  SEASON_SHARE: 1 / 3,
  seasonTooDry(seg, ctx) {
    return ctx.water === "rainfed" && !seg.crop.other && seg.rainIn < seg.crop.rmin * this.SEASON_SHARE;
  },

  // Kuru mevsime ekim (ekip kararı): kuru tarımda, ürünün tarladaki ilk iki ayında toplam yağış 30 mm'nin
  // altındaysa "ekim dönemi fazla kuru" sayılır. Alternatiflerde böyle ürün aday olmaz; çiftçinin kendi
  // ürününde yalnızca risk cümlesi çıkar. 30 mm eşiği ekibin seçimidir, bir kaynaktan gelmez.
  SOWING_MIN_RAIN: 30,
  sowingTooDry(seg, ctx) {
    return ctx.water === "rainfed" && !seg.crop.other && seg.rainStart < this.SOWING_MIN_RAIN;
  },

  // Kışlık ekimin başlayabileceği aylar (ekip kararı): o yerin en soğuk ayından 2 ila 4 ay önce.
  // En soğuk aydan hemen önceki ay HARİÇTİR (ör. en soğuk ay Ocak ise Eylül, Ekim, Kasım; Aralık değil):
  // kışa girerken ekilen ürün soğuktan önce tutunamaz (Iowa'da "Aralık'ta kanola" çıkıyordu).
  // En soğuk ayın ortalaması 15°C'nin üstündeyse o yerde kış yok sayılır ve kışlık yerleştirme yapılmaz.
  // "2–4 ay" ve "15°C" ekibin seçimidir, bir kaynaktan gelmez. Dönen değer: izinli aylar (0–11) ya da boş liste.
  WINTER_LEAD_MIN: 2,
  WINTER_LEAD_MONTHS: 4,
  NO_WINTER_ABOVE: 15,
  winterSowMonths(d) {
    const coldest = d.monthTemp.indexOf(Math.min(...d.monthTemp));
    if (d.monthTemp[coldest] > this.NO_WINTER_ABOVE) return [];
    return Array.from({ length: this.WINTER_LEAD_MONTHS - this.WINTER_LEAD_MIN + 1 }, (_, k) => (coldest - this.WINTER_LEAD_MIN - k + 12) % 12);
  },

  // ---------- Alternatif üretimi ----------
  // Bir ürünü, verilen pencereye (start'tan başlayan length ay) yerleştirir. Süre kadar art arda
  // "uygun değil" olmayan ay gerekir. Kuru ve kısıtlı sulamada en çok yağış alan, sulu tarımda en çok
  // "uygun" ay içeren başlangıç seçilir. Uygun yer yoksa null.
  place(crop, start, length, ctx) {
    const months = Calendar.cropMonths(crop, ctx.d);
    const durations = [crop.typicalMonths, crop.winterMonths].filter(Boolean);
    const winterStarts = this.winterSowMonths(ctx.d);
    let best = null;
    durations.forEach(len => {
      // Tipik (yazlık) süre kış beklemesi aylarını içeremez: bitki o aylarda büyümez, süre yetmez.
      // Kış beklemesine yalnızca ekibin verdiği kışlık süreyle (winterMonths) yerleştirirken izin verilir.
      const winterVariant = len === crop.winterMonths && len !== crop.typicalMonths;
      for (let s = start; s <= start + Math.min(length - len, 11); s++) {
        // Kışlık ekim yalnızca en soğuk aydan 2–4 ay önce başlayabilir; kışı olmayan yerde hiç yapılmaz
        if (winterVariant && !winterStarts.includes(s % 12)) continue;
        let good = 0, edge = 0, rain = 0, ok = true;
        for (let m = s; m < s + len && ok; m++) {
          const st = months[m % 12].status;
          if (st === "bad" || (st === "wait" && !winterVariant)) ok = false;
          else { if (st === "good") good++; if (st === "edge") edge++; rain += ctx.d.monthRain[m % 12]; }
        }
        if (!ok) continue;
        const fit = (good + edge / 2) / len;
        const rank = ctx.water === "irrigated" ? [fit, rain] : [rain, fit];
        if (!best || rank[0] > best.rank[0] + 1e-9 || (Math.abs(rank[0] - best.rank[0]) < 1e-9 && rank[1] > best.rank[1])) {
          best = { rank, sow: (s % 12) + 1, harvest: ((s + len - 1) % 12) + 1, winter: winterVariant };
        }
      }
    });
    return best;
  },

  // Alternatiflerde önerilebilecek ürünler: süresi bilinen, 12 aydan uzun olmayan ve (sulama yoksa)
  // buranın yağışı en azının altında kalmayan ürünler
  candidates(ctx) {
    return CROPS.filter(c => !c.longCycle && (c.typicalMonths || c.winterMonths) &&
      !(ctx.water !== "irrigated" && ctx.rain < c.rmin));
  },

  signature(rows) {
    return rows.map(p => `${p.crop}${p.crop === OTHER ? "=" + (p.name || "").trim().toLocaleLowerCase(LANG) : ""}:${p.sow || 0}:${p.harvest || 0}`).join("|");
  },

  // Tek hamleyle üretilen bütün geçerli rotasyonlar: [{ rows, ev, kind: "fill" | "swap", crop, replaced }]
  moves(periods, ctx) {
    const tl = this.timeline(periods);
    const out = [];
    const cands = this.candidates(ctx);
    const cropSegs = tl.segs.filter(s => !s.fallow);
    const cycleEnd = tl.first + tl.months;

    const tryRows = (rows, crop, kind, replaced, placed, filledFallow, winter) => {
      const ev = this.evaluate(rows, ctx);
      if (!ev) return;
      const seg = ev.tl.segs.find(s => !s.fallow && s.period === placed);
      // Yeniden dizince uygun olmayan aya denk geldiyse geçersiz. Yeni ürünün hasat ayı da "uygun değil"
      // olamaz (ekip kararı: puan ve risk cümlesi hasat ayını saymaz, ama yerleştirme sayar; yoksa
      // sonbaharda ekilip donla biten yaz ürünleri geçerli hamle oluyordu).
      if (!seg || seg.status.bad > 0) return;
      if (seg.status.wait > 0 && !winter) return; // kışı tarlada geçirmek yalnızca kışlık süreyle olur
      if (this.seasonTooDry(seg, ctx)) return; // kuru tarımda mevsimi fazla kuru olan ürün aday olmaz
      if (this.sowingTooDry(seg, ctx)) return; // kuru tarımda ekim dönemi fazla kuru olan ürün aday olmaz
      // Önceki ve sonraki ürünle aynı aileden olamaz (nadas komşu sayılmaz)
      const i = ev.tl.segs.indexOf(seg), n = ev.tl.segs.length;
      const prev = ev.tl.segs[(i + n - 1) % n], next = ev.tl.segs[(i + 1) % n];
      if (n > 1 && [prev, next].some(s => !s.fallow && s !== seg && s.crop.family === crop.family)) return;
      out.push({ rows, ev, kind, crop, replaced, filledFallow: Boolean(filledFallow) });
    };

    // (a) Boşluğu doldur: bir üründen sonra gelen ürünsüz dönem (içindeki nadas yılları kalkar)
    tl.segs.forEach((seg, k) => {
      if (seg.fallow) return;
      let j = k + 1;
      while (j < tl.segs.length && tl.segs[j].fallow) j++;
      const gapStart = seg.end + 1;
      const gapEnd = (j < tl.segs.length ? tl.segs[j].start : cycleEnd) - 1;
      const length = gapEnd - gapStart + 1;
      if (length < 2) return;
      cands.forEach(crop => {
        const spot = this.place(crop, gapStart, length, ctx);
        if (!spot) return;
        const placed = { crop: crop.id, sow: spot.sow, harvest: spot.harvest };
        const rows = [...tl.rows.slice(0, k + 1), placed, ...tl.rows.slice(j)];
        tryRows(rows, crop, "fill", null, placed, j > k + 1, spot.winter); // j > k + 1: boşlukta nadas yılı vardı
      });
    });

    // (b) Bir ürünü değiştir: eski ürünün başladığı aydan sonraki ürüne kadar olan pencereye sığmalı
    cropSegs.forEach(seg => {
      if (seg.crop.other) return; // verisini bilmediğimiz ürünün yerine "daha iyisi" önerilemez
      const k = tl.segs.indexOf(seg);
      const windowEnd = (k + 1 < tl.segs.length ? tl.segs[k + 1].start : cycleEnd) - 1;
      cands.forEach(crop => {
        if (crop.id === seg.crop.id) return;
        const spot = this.place(crop, seg.start, windowEnd - seg.start + 1, ctx);
        if (!spot) return;
        const placed = { crop: crop.id, sow: spot.sow, harvest: spot.harvest };
        const rows = [...tl.rows.slice(0, k), placed, ...tl.rows.slice(k + 1)];
        tryRows(rows, crop, "swap", seg.crop, placed, false, spot.winter);
      });
    });
    return out;
  },

  // Çiftçinin KENDİ ürünleriyle daha yüksek puanlı bir düzen var mı? (ekip kararı, yöntem B)
  // Ürün eklenmez, çıkarılmaz, değiştirilmez; nadas yerinde kalır. Değişebilenler: ürünlerin sırası ve ekim ayı.
  // Her ürün çiftçinin girdiği süre kadar tarlada kalır (hasat ayı ekimle birlikte kayar). Ekim ayı en fazla 2 ay kayabilir. "Diğer" ürünlerin ayları
  // değişmez. Kaydırılan ekim, motorun yerleştirme kurallarına uyar: uygun olmayan ay yok; kış beklemesi yalnızca
  // kışlık ekilebilen üründe ve kışlık ekim penceresinde; kuru tarımda mevsim ve ekim dönemi yağış eşikleri.
  // Çiftçinin kendi ayları her zaman bir seçenektir. Ürün çokken her ürün için en iyi birkaç ekim ayı denenir.
  // Dönen değer: { base, best: { rows, ev, changes }, improved, order (sıra değişti mi), moves: [{ crop, from, to }] }.
  // improved: kartta görünen (bir ondalığa yuvarlanmış) toplam puan arttıysa true.
  REORDER_MAX_SHIFT: 2, // önerilen ekim ayı, çiftçinin girdiği ekim ayından en fazla 2 ay ileri ya da geri olabilir (ekip kararı)
  bestOrder(periods, ctx) {
    const rows = periods.filter(p => this.isComplete(p));
    const base = this.evaluate(rows, ctx);
    if (!base) return null;
    const slots = rows.map((r, i) => (r.crop === FALLOW ? -1 : i)).filter(i => i >= 0), n = slots.length;
    const keep = n <= 2 ? 11 : n === 3 ? 6 : n === 4 ? 4 : n === 5 ? 2 : 1;
    const winterStarts = this.winterSowMonths(ctx.d);
    const choices = slots.map(i => {
      const r = rows[i], out = [{ sow: r.sow, harvest: r.harvest, orig: true }];
      if (r.crop === OTHER) return out;
      const crop = CROPS.find(c => c.id === r.crop), months = Calendar.cropMonths(crop, ctx.d);
      const len = ((r.harvest - r.sow + 12) % 12) + 1, found = [];
      for (let s = 0; s < 12; s++) {
        if (s === r.sow - 1) continue;
        if (Math.min((s - (r.sow - 1) + 12) % 12, ((r.sow - 1) - s + 12) % 12) > this.REORDER_MAX_SHIFT) continue;
        let good = 0, edge = 0, wait = 0, rain = 0, ok = true;
        for (let m = s; m < s + len && ok; m++) {
          const st = months[m % 12].status;
          if (st === "bad") ok = false;
          else { if (st === "good") good++; if (st === "edge") edge++; if (st === "wait") wait++; rain += ctx.d.monthRain[m % 12]; }
        }
        if (!ok || (wait > 0 && !(crop.winterCrop && winterStarts.includes(s)))) continue;
        if (ctx.water === "rainfed" && (rain < crop.rmin * this.SEASON_SHARE ||
          ctx.d.monthRain[s] + (len > 1 ? ctx.d.monthRain[(s + 1) % 12] : 0) < this.SOWING_MIN_RAIN)) continue;
        found.push({ sow: s + 1, harvest: ((s + len - 1) % 12) + 1, rank: [(good + edge / 2) / len, rain] });
      }
      found.sort((a, b) => b.rank[0] - a.rank[0] || b.rank[1] - a.rank[1]);
      return out.concat(found.slice(0, keep));
    });
    const perms = a => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map(p => [x, ...p])));
    let best = { rows, ev: base, changes: 0, order: false, moves: [] };
    perms(slots.map((_, k) => k)).forEach(order => {
      const pick = new Array(n).fill(0);
      const step = k => {
        if (k < n) { for (let j = 0; j < choices[k].length; j++) { pick[k] = j; step(k + 1); } return; }
        const out = rows.map(r => ({ ...r })), moves = [];
        let changes = 0, moved = false;
        order.forEach((src, slot) => {
          const r = rows[slots[src]], c = choices[src][pick[src]];
          out[slots[slot]] = { ...r, sow: c.sow, harvest: c.harvest };
          if (!c.orig) { changes++; moves.push({ row: r, from: r.sow, to: c.sow, harvest: c.harvest }); }
          if (src !== slot) { changes++; moved = true; }
        });
        const ev = this.evaluate(out, ctx);
        if (ev && (ev.total > best.ev.total + 1e-9 || (Math.abs(ev.total - best.ev.total) < 1e-9 && changes < best.changes))) best = { rows: out, ev, changes, order: moved, moves };
      };
      step(0);
    });
    return { base, best, improved: Math.round(best.ev.total * 10) > Math.round(base.total * 10) };
  },

  // Bir rotasyonun ürün kümesi (sıradan ve aylardan bağımsız): "barley+lentil"
  cropKey(ev) {
    return [...new Set(ev.crops.map(s => s.crop.id))].sort().join("+");
  },

  // "Bölgeniz için başka rotasyon fikirleri" (ekip kararı): çiftçinin rotasyonundan BAĞIMSIZ, iki ürünlü rotasyonlar.
  // İlk ürün kendi en iyi aylarına yerleşir (place: kuru tarımda en yağışlı, sulu tarımda en uygun dönem);
  // ikinci ürün birincinin bıraktığı boşluğa yerleşir: önce aynı yılın kalanına, sığmazsa bir yıl daha eklenir.
  // Aynı kurallar geçerlidir (uygun olmayan ay yok, kışlık ekim penceresi, yağış eşikleri, art arda aynı aile yok)
  // ve aynı ağırlıklarla puanlanır. Her ürün çifti için en yüksek puanlı sıra tutulur; kartlarda zaten görünen
  // ürün kümeleri (shownKeys) atılır; toplamı en yüksek en çok "max" fikir döner. Farklı iki çift en çok bir ürünü
  // paylaşabildiği için fikirler arasında en çok bir ortak ürün olur.
  ideas(ctx, shownKeys = [], max = 3) {
    const cands = this.candidates(ctx), best = new Map();
    const span = spot => (spot.harvest - spot.sow + 12) % 12;
    cands.forEach(a => {
      const sa = this.place(a, 0, 24, ctx);
      if (!sa) return;
      const a0 = sa.sow - 1, from = a0 + span(sa) + 1;
      cands.forEach(b => {
        if (b === a || b.family === a.family) return;
        let end = a0 + 12;
        while (end <= from) end += 12;
        let sb = null;
        for (const len of [end - from, end - from + 12]) {
          if (len >= 2) sb = this.place(b, from, len, ctx);
          if (sb) break;
        }
        if (!sb) return;
        const rows = [{ crop: a.id, sow: sa.sow, harvest: sa.harvest }, { crop: b.id, sow: sb.sow, harvest: sb.harvest }];
        const ev = this.evaluate(rows, ctx), winter = [sa.winter, sb.winter];
        if (!ev || ev.crops.some((seg, i) => seg.status.bad > 0 || (seg.status.wait > 0 && !winter[i]) ||
          this.seasonTooDry(seg, ctx) || this.sowingTooDry(seg, ctx))) return;
        const key = this.cropKey(ev);
        if (!best.has(key) || ev.total > best.get(key).ev.total + 1e-9) best.set(key, { rows, ev, key });
      });
    });
    return [...best.values()].filter(x => !shownKeys.includes(x.key)).sort((x, y) => y.ev.total - x.ev.total).slice(0, max);
  },

  // Üç strateji kendi en iyi hamlesini seçer; aynı rotasyon birleştirilir; toplamı en yüksek iki tanesi döner.
  alternatives(periods, ctx) {
    const current = this.evaluate(periods, ctx);
    if (!current) return { current: null, options: [] };
    const all = this.moves(periods, ctx);
    const pick = (list, value) => list.slice().sort((a, b) => value(b) - value(a) || b.ev.total - a.ev.total)[0];
    const winners = [];

    // "Değiştir" hamlesi Su tasarruflu stratejide her zaman yapılabilir. Toprak sağlığı ve Pazar odaklıda
    // yalnızca rotasyonda en az 2 farklı ürün varsa yapılır; tek ürünlü rotasyonda bu iki strateji yalnızca
    // boşluğu ya da nadası doldurur (ekip kararı: çiftçinin tek ürünü elinden alınmasın).
    const canSwap = current.detail.distinctCrops >= 2;

    // Toprak sağlığı: boşluğu/nadası baklagille doldur ya da baklagil olmayan bir ürünü baklagille değiştir
    const soil = pick(all.filter(m => m.crop.legume && m.ev.soil > current.soil + 0.01 &&
      (m.kind === "fill" || (canSwap && !m.replaced.legume))), m => m.ev.soil);
    if (soil) winners.push({ ...soil, strategies: ["soil"] });

    // Su tasarruflu: bir ürünü yağışa daha uygun bir ürünle değiştir (nadası korur); su puanı artmalı
    const water = pick(all.filter(m => m.kind === "swap" && m.ev.scores.water > current.scores.water + 0.05), m => m.ev.scores.water);
    if (water) winners.push({ ...water, strategies: ["water"] });

    // Pazar odaklı: boşluğu/nadası ya da kolay satılmayan bir ürünü, kolay satılan bir ürünle doldur/değiştir
    let market = null;
    if (ctx.sell.length) {
      market = pick(all.filter(m => ctx.sell.includes(m.crop.id) &&
        (m.kind === "fill" ? m.ev.scores.sell >= current.scores.sell : canSwap && !ctx.sell.includes(m.replaced.id))), m => m.ev.scores.sell);
      if (market) winners.push({ ...market, strategies: ["market"] });
    }

    const merged = [];
    const currentSig = this.signature(current.tl.rows);
    winners.forEach(w => {
      const sig = this.signature(w.ev.tl.rows);
      if (sig === currentSig) return;
      const same = merged.find(m => m.sig === sig);
      if (same) same.strategies.push(...w.strategies);
      else merged.push({ ...w, sig });
    });
    merged.sort((a, b) => b.ev.total - a.ev.total);
    // Yalnızca gerçek strateji sonuçları gösterilir: en çok 3 farklı rotasyon (ekip kararı, 14 Kasım 2026 gece).
    // Eski yedek "Başka bir olasılık" kartları KALDIRILDI; onların işini "Başka fikirler" bölümü görür (ideas).
    const options = merged.slice(0, 3);

    // Üç kart çıkmadığında nedenini açıklamak için: hangi strateji sonuç üretemedi, hangileri aynı sonucu verdi
    return {
      current, options, found: merged.length,
      strategies: merged, // stratejilerin bulduğu bütün farklı rotasyonlar (toplam puana göre sıralı)
      // Kartların üstündeki cümle js/cards.js'te seçilir (Cards.render): stratejiler sonuç üretmediyse,
      // "Başka fikirler"den biri mevcut rotasyonu (kartta görünen yuvarlanmış puanla) geçiyorsa "neutral", yoksa "strong".
      why: {
        soil: !soil, water: !water, market: !market, noSell: !ctx.sell.length, singleCrop: !canSwap,
        merged: merged.filter(m => m.strategies.length > 1).map(m => m.strategies)
      }
    };
  }
};
