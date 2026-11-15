// AI disclosure: written with AI assistance (Anthropic Claude, via Claude Code); reviewed and edited by the DECO team.
// Aşama 3: rotasyon kartları (mevcut rotasyon + en fazla üç alternatif).
// Aşama 4: "gelecek iklim" kaydırıcıları açıkken aynı kartlar kaydırılmış iklimle yeniden puanlanır
// (kartlardaki rotasyonlar sabit kalır; yalnızca puanlar ve riskler güncellenir).
// Hesap js/rotation.js ve js/future.js'te; burada yalnızca metinler seçilir ve kartlar çizilir.
// Risk ve bilgi boşluğu cümleleri kurallarla tetiklenen hazır cümlelerdir (i18n.js "s3" bölümü; ekipçe onaylandı).

const CRITERIA = ["climate", "water", "nitrogen", "cover", "pest", "sell"];

// "Bu seçeneği incele" panelindeki yardım bağlantıları (15 Kasım 2026'da üçünün de açıldığı kontrol edildi)
const HELP_LINKS = [
  { name: "FAO Conservation Agriculture", url: "https://www.fao.org/conservation-agriculture/en/",
    use: { en: "principles of rotation and soil cover", tr: "ekim nöbeti ve toprak örtüsü ilkeleri" } },
  { name: "NASA POWER", url: "https://power.larc.nasa.gov/",
    use: { en: "the climate data used for your field", tr: "tarlanız için kullanılan iklim verisi" } },
  { name: "NASA Earthdata", url: "https://www.earthdata.nasa.gov/",
    use: { en: "NASA's Earth observation data", tr: "NASA'nın yer gözlem verileri" } }
];

const Cards = {
  state: null, // son çizilen karşılaştırma: { periods, ctx, result }

  names(crops) {
    return [...new Set(crops.map(c => c.name[LANG]))].join(", ");
  },

  // Rotasyonun adı: "Buğday → Nadas"
  title(tl) {
    return tl.segs.map(s => (s.fallow ? t("fallowShort") : s.crop.name[LANG])).join(" → ");
  },

  // Kuralla tetiklenen bilgi boşlukları
  gaps(ev, ctx, option) {
    const T = I18N[LANG].s3, out = [];
    // "Diğer" ürünler: verimiz yok. Diğer bilgi boşlukları yalnızca listedeki ürünler için yazılır.
    ev.detail.others.forEach(name => out.push(T.gapOther(name)));
    const crops = [...new Set(ev.crops.filter(s => !s.crop.other).map(s => s.crop))];
    if (option && !option.crop.typicalMonthsApproved) out.push(T.gapDuration(option.crop.name[LANG]));
    if (ctx.soil === "unknown") out.push(T.gapSoil);
    if (!ctx.sell.length) out.push(T.gapSell);
    const unverified = crops.filter(c => /kontrol/i.test(c.check));
    if (unverified.length) out.push(T.gapEcocrop(this.names(unverified)));
    const teamFrost = crops.filter(c => c.frostSource === "team");
    if (teamFrost.length) out.push(T.gapFrost(this.names(teamFrost)));
    const noWater = crops.filter(c => !c.waterNeed);
    if (noWater.length) out.push(T.gapWater(this.names(noWater)));
    return out;
  },

  // Kuralla tetiklenen riskler. Her risk { key, text } döner; key, gelecek iklimde "yeni" çıkan riski
  // bugünkülerle karşılaştırmak içindir (metindeki sayılar değişse de aynı risk aynı anahtarı taşır).
  risks(ev, ctx, option) {
    const T = I18N[LANG].s3, out = [];
    const add = (key, text) => out.push({ key, text });
    // Sıcaklık kaydırıcısı açıkken cümledeki yağış sayısı buharlaşma düşülmüş "etkili yağış"tır; cümleye kısa ek yapılır
    const et = ctx.et0Ratio > 1 ? ` ${T.riskEtNote}` : "";
    if (option) add("new", T.riskNew(option.crop.name[LANG]));
    // Kuru tarımda nadas bir ürünle doldurulduysa: nadasın su biriktirme işlevi kaybolur
    if (option && option.filledFallow && ctx.water === "rainfed") add("fallowWater", T.riskFallowWater);
    // Çiftçinin kendi ürünü tarladayken çok az yağış düşüyorsa (alternatiflerde böyle ürün zaten aday olmaz)
    ev.crops.filter(s => Rotation.seasonTooDry(s, ctx)).forEach(s => add(`season:${s.crop.id}:${s.start}`, T.riskSeason(s.crop.name[LANG], fmt(s.rainIn), fmt(s.crop.rmin)) + et));
    // Çiftçinin kendi ürünü kuru mevsime ekiliyorsa (ilk iki ayda 30 mm'den az yağış)
    ev.crops.filter(s => Rotation.sowingTooDry(s, ctx)).forEach(s => add(`sowing:${s.crop.id}:${s.start}`, T.riskSowing(s.crop.name[LANG], fmt(s.rainStart)) + et));
    [...new Set(ev.crops.map(s => s.crop))].forEach(c => {
      if (ctx.rain < c.rmin && ctx.water !== "irrigated") add(`rain:${c.id}`, T.riskRain(c.name[LANG], fmt(ctx.rain), fmt(c.rmin), ctx.water) + et);
    });
    // Hasat ayı sayılmaz (iklim uyumu puanıyla tutarlı)
    ev.crops.filter(s => s.badBeforeHarvest > 0).forEach(s => add(`months:${s.crop.id}:${s.start}`, T.riskMonths(s.crop.name[LANG], s.badBeforeHarvest)));
    ev.detail.samePairs.forEach(([a, b]) => add(`family:${a.id}:${b.id}`, T.riskFamily(a.name[LANG], b.name[LANG])));
    if (ev.detail.longestBare > 3) add("bare", T.riskBare(ev.detail.longestBare));
    if (ctx.slope === "steep" && ev.detail.bareShare > 0.3) add("steep", T.riskSteep(fmt(ev.detail.bareShare * 100)));
    if (ctx.soil === "sandy" && ctx.water !== "irrigated") add("sandy", T.riskSandy);
    if (ctx.soil === "clay") add("clay", T.riskClay);
    return out;
  },

  evidence(ev, ctx, option) {
    const T = I18N[LANG].s3;
    const out = [T.evRain(fmt(ctx.rain)), T.evBare(fmt(ev.detail.bareShare * 100))];
    // Yeni ürün tarladayken düşen yağış: yıllık toplam mevsimi göstermediği için ayrıca yazılır
    const placed = option && ev.crops.find(s => s.crop === option.crop);
    if (placed) {
      let mm = 0;
      for (let m = placed.start; m <= placed.end; m++) mm += ctx.d.monthRain[m % 12];
      out.push(T.evInField(option.crop.name[LANG], fmt(mm)));
    }
    [...new Set(ev.crops.filter(s => !s.crop.other).map(s => s.crop))].forEach(c => {
      out.push(T.evCrop(c.name[LANG], fmt(c.rmin), fmt(c.ropmn), fmt(c.ropmx)));
      if (c.waterNeed) out.push(T.evWater(c.name[LANG], fmt(c.waterNeed.min), fmt(c.waterNeed.max)));
    });
    return out;
  },

  // Alternatifin mevcut rotasyona göre farkı: belirgin değişen ölçütler
  versus(ev, current, other) {
    const T = I18N[LANG].s3, out = [];
    let best = null;
    CRITERIA.forEach(k => {
      const a = current.scores[k], b = ev.scores[k];
      if (a === null || b === null) return;
      const diff = b - a;
      if (Math.abs(diff) >= 0.3) out.push(T.versusLine(diff > 0, T.criteria[k], fmt(a, 1), fmt(b, 1)));
      if (diff > 0 && (!best || diff > best.diff)) best = { diff, name: T.criteria[k] };
    });
    if (!out.length) out.push(T.versusSame);
    if (ev.total < current.total - 0.05) {
      // "Başka bir olasılık" kartı bir öneri değil, karşılaştırmadır
      if (other) out.unshift(T.versusOtherLower);
      else if (best) out.unshift(T.versusLower(best.name));
    }
    return out;
  },

  why(option) {
    const T = I18N[LANG].s3;
    const n = option.crop.name[LANG], o = option.replaced ? option.replaced.name[LANG] : null;
    return option.strategies.map(s => (s === "other" ? T.whyOther : T.why[s](n, o)));
  },

  // Aşama 4: toprak üzerindeki etkinin yönü (sayı yok). Bugünün hesabından gelir; kaydırıcıyla değişmez.
  //  - Erozyon riski: yağmurun çıplak toprağa düşen payı sizinkinden en az 10 puan düşük/yüksekse yön değişir.
  //  - Azot: azot katkısı puanının sizinkine göre yönü.
  //  - Organik madde: tarlanın ürünlü olduğu ayların payı (FAO Koruyucu Tarım: toprağı örtülü tutma ilkesi).
  // Sizin rotasyonunuzun kartında yön değil düzey yazılır (karşılaştırılacak bir önceki hâl yok).
  soilTrend(ev, current, isCurrent) {
    const T = I18N[LANG].s3.soil;
    const covered = e => e.tl.occupied.size / e.tl.months;
    if (isCurrent) {
      const c = ev.scores.cover;
      return [
        T.level.erosion[c >= 4 ? "low" : c >= 3 ? "mid" : "high"],
        T.level.nitrogen[ev.scores.nitrogen > 1 ? "some" : "none"],
        T.level.organic(ev.tl.occupied.size, ev.tl.months)
      ];
    }
    const dir = (diff, eps) => (diff > eps ? "up" : diff < -eps ? "down" : "same");
    return [
      T.dir.erosion[dir(ev.detail.bareShare - current.detail.bareShare, 0.0999)],
      T.dir.nitrogen[dir(ev.scores.nitrogen - current.scores.nitrogen, 0)],
      T.dir.organic[dir(covered(ev) - covered(current), 1e-9)]
    ];
  },

  // Döngünün ay ay şeridi: ürünler, nadas ve boş dönemler ayları kadar yer kaplar
  strip(tl) {
    const names = t("months").map(m => m.slice(0, 3));
    const bar = document.createElement("div");
    bar.className = "opt-strip";
    const add = (cls, length, label, tip) => {
      if (length <= 0) return;
      const part = document.createElement("div");
      part.className = `opt-part ${cls}`;
      part.style.flexGrow = length;
      part.textContent = label;
      part.title = tip;
      bar.appendChild(part);
    };
    // Döngünün son ayı: son ürünün hasat ayı ilk ürünün ekim ayına denk geliyorsa (ortak ay) o ay şeritte
    // bir kez, döngünün başında çizilir; son ürünün parçası döngünün son ayında biter.
    let prevEnd = tl.first - 1, n = 0;
    const lastMonth = tl.first + tl.months - 1;
    tl.segs.forEach(s => {
      if (s.fallow) { add("opt-fallow", 12, t("fallowShort"), I18N[LANG].s3.stripFallow); prevEnd = s.end; return; }
      add("opt-bare", s.start - prevEnd - 1, "", I18N[LANG].s3.stripBare(s.start - prevEnd - 1));
      const span = `${names[s.start % 12]}–${names[s.end % 12]}`;
      add(`opt-crop opt-crop${n++ % 2}`, Math.min(s.end, lastMonth) - Math.max(s.start, prevEnd + 1) + 1, s.crop.name[LANG], `${s.crop.name[LANG]}: ${span}`);
      prevEnd = s.end;
    });
    add("opt-bare", lastMonth - prevEnd, "", I18N[LANG].s3.stripBare(lastMonth - prevEnd));
    return bar;
  },

  // items: düz metinler ya da { text, isNew } (isNew: gelecek iklimde yeni çıkan risk)
  list(items) {
    const ul = document.createElement("ul");
    (items.length ? items : [I18N[LANG].s3.none]).forEach(item => {
      const li = document.createElement("li");
      if (item.isNew) {
        const badge = document.createElement("span");
        badge.className = "opt-new";
        badge.textContent = I18N[LANG].s3.futureNew;
        li.append(badge, " ");
      }
      li.append(typeof item === "string" ? item : item.text);
      ul.appendChild(li);
    });
    return ul;
  },

  // Uzun bir "Bilimsel detay" metnini kısa başlıklı bölümlere ayırarak yazar. Metnin içeriği değişmez: her bölüm,
  // heads listesindeki sözcüklerle başlayan cümleden başlar. Bir başlangıç bulunamazsa metin tek parça yazılır.
  sectioned(node, text, heads) {
    const cuts = heads.map(([title, start]) => {
      const at = start === "" ? 0 : [].concat(start).map(s => text.indexOf(s)).find(i => i >= 0);
      return { title, at: at === undefined ? -1 : at };
    });
    node.textContent = "";
    if (cuts.some((c, i) => c.at < 0 || (i && c.at <= cuts[i - 1].at))) { node.textContent = text; return; }
    cuts.forEach((c, i) => {
      const part = document.createElement("span"), b = document.createElement("b");
      part.className = "sci-part";
      b.textContent = `${c.title}. `;
      part.append(b, text.slice(c.at, i + 1 < cuts.length ? cuts[i + 1].at : text.length).trim());
      node.appendChild(part);
    });
  },

  // "Aynı ürünlerle şu değişiklik puanı artırıyor: …" ya da "… düzeniniz zaten en iyi görünüyor."
  reorderText(r) {
    const T = I18N[LANG].s3;
    if (!r.improved) return T.reorderBest;
    const name = row => (row.crop === OTHER ? Rotation.otherCrop(row).name[LANG] : cropName(row.crop));
    const parts = [];
    if (r.best.order) parts.push(T.reorderOrder(this.title(r.best.ev.tl)));
    r.best.moves.forEach(m => parts.push(T.reorderSow(name(m.row), t("months")[m.from - 1], T.monthsIn[m.to - 1], t("months")[m.harvest - 1])));
    return T.reorderBetter(parts.join("; "), fmt(r.base.total, 1), fmt(r.best.ev.total, 1));
  },

  // ---------- "Bu seçeneği incele": kartın altında açılan ayrıntı paneli ----------
  // Yalnızca motorun gerçekten hesapladığı değerler yazılır (puanlar, ay sayıları, yağış, ECOCROP aralıkları).
  // Doz, verim, gübre miktarı gibi tarım bilgisi YAZILMAZ; onlar için yerel danışmana yönlendirilir.
  toggleDetail(key) {
    this.detailKey = this.detailKey === key ? null : key;
    // Açılan rotasyonun imzası o anda saklanır (form satırları sonradan yerinde değiştiği için)
    this.detailSig = this.detailKey ? Rotation.signature(this.detailItems[key].it.ev.tl.rows) : null;
    this.renderDetail();
    const box = this.detailKey && this.detailBoxes[this.detailKey[0]];
    if (box) box.scrollIntoView({ behavior: "smooth", block: "nearest" });
  },

  renderDetail() {
    // İki panel kutusu bir kez bulunur ve saklanır: kartlar yeniden çizilirken kutu kartların arasındaysa
    // sayfadan düşer; her seferinde yerine (kartların altına) geri konur.
    this.detailBoxes = this.detailBoxes || { m: el("optionDetail"), i: el("ideaDetail") };
    const T = I18N[LANG].s3, main = this.detailBoxes.m, idea = this.detailBoxes.i;
    el("optionCards").after(main);
    el("ideaCards").after(idea);
    main.hidden = idea.hidden = true;
    main.innerHTML = idea.innerHTML = "";
    if (this.detailKey && !(this.detailItems || {})[this.detailKey]) this.detailKey = null;
    document.querySelectorAll("#planOptions [data-detail]").forEach(b => {
      const open = b.dataset.detail === this.detailKey;
      b.textContent = open ? T.inspectClose : T.inspect;
      b.setAttribute("aria-expanded", open);
    });
    if (!this.detailKey) return;
    const d = this.detailItems[this.detailKey], box = this.detailKey[0] === "i" ? idea : main;
    box.hidden = false;
    box.appendChild(this.detail(d.it, d.ctx, d.fctx, d.cur));
    // Kartlar alt alta diziliyse (dar ekran) panel, tıklanan kartın hemen altına konur
    const btn = document.querySelector(`#planOptions [data-detail="${this.detailKey}"]`);
    const card = btn && btn.closest(".opt-card"), cards = card ? [...card.parentNode.querySelectorAll(".opt-card")] : [];
    if (cards.length > 1 && cards[1].offsetTop > cards[0].offsetTop) card.after(box);
  },

  detail(it, ctx, fctx, cur) {
    const T = I18N[LANG].s3, D = T.detail;
    const e = it.fut || it.ev, c = fctx || ctx, option = it.option, idea = it.idea || 0;
    const mon = t("months"), short = mon.map(m => m.slice(0, 3));
    const n1 = v => fmt(v, 1);
    const root = document.createElement("article");
    root.className = "od";
    const add = (parent, tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; parent.appendChild(n); return n; };
    const list = (parent, items) => { const ul = add(parent, "ul", "od-list"); items.forEach(x => add(ul, "li", "", x)); return ul; };

    add(root, "h4", "od-title", D.title(this.title(it.ev.tl)));
    if (fctx) add(root, "p", "od-note", D.future(T.tempShort(Future.dT), T.rainShort(Future.dP)));

    // ---- a. Bilimsel açıklama: altı ölçüt, kural ve veri ----
    add(root, "h5", "od-h", D.sciTitle);
    add(root, "p", "od-lead", D.sciLead);
    const known = e.crops.filter(s => !s.crop.other), others = e.detail.others;
    const crit = (k, lines) => {
      const box = add(root, "div", "od-crit");
      add(box, "p", "od-crit-head", `${T.criteria[k]}: ${e.scores[k] === null ? "–" : n1(e.scores[k])} / 5`);
      add(box, "p", "od-rule", T.howText[k]);
      list(box, lines);
    };
    const span = s => `${short[s.start % 12]}–${short[s.end % 12]}`;

    // İklim uyumu
    const g = e.detail.counts, counted = g.good + g.edge + g.bad, cl = [];
    known.forEach(s => cl.push(D.climateCrop(s.crop.name[LANG], span(s), s.end - s.start + 1, s.status, fmt(s.crop.topmn), fmt(s.crop.topmx), fmt(s.crop.tmin), fmt(s.crop.tmax))));
    others.forEach(name => cl.push(T.gapOther(name)));
    if (e.scores.climate !== null) cl.push(counted ? D.climateSum(g.good, g.edge, g.bad, counted, n1(e.scores.climate)) : D.climateNone);
    cl.push(D.climateData);
    crit("climate", cl);

    // Su
    const wl = [fctx ? D.waterRainFuture(fmt(c.rain), fmt(ctx.rain)) : D.waterRain(fmt(c.rain))];
    known.forEach(s => wl.push(D.waterCrop(s.crop.name[LANG], fmt(s.crop.rmin), fmt(s.crop.ropmn), fmt(s.crop.ropmx), fmt(s.crop.rmax), n1(s.water), span(s), fmt(s.rainIn), fmt(s.rainStart))));
    wl.push(D.waterMode[c.water]);
    if (known.length > 1) wl.push(D.waterAvg(n1(e.scores.water)));
    crit("water", wl);

    // Azot katkısı
    const legumes = e.crops.filter(s => s.crop.legume);
    crit("nitrogen", [D.nitrogen(e.crops.length, legumes.length, this.names(legumes.map(s => s.crop)), fmt(e.detail.legumeShare * 100), n1(e.scores.nitrogen)), D.nitrogenNote]);

    // Toprak örtüsü
    const bare = e.detail.bareShare, base = bare <= 0.15 ? 5 : bare <= 0.3 ? 4 : bare <= 0.5 ? 3 : bare <= 0.7 ? 2 : 1;
    crit("cover", [D.cover(fmt(bare * 100), base), D.coverSlope[c.slope], D.coverScore(n1(e.scores.cover)), D.coverData]);

    // Zararlı döngüsü
    const segs = e.tl.segs, fam = s => (s.fallow ? FALLOW : s.crop.family);
    const same = segs.filter((s, i) => fam(s) === fam(segs[(i + 1) % segs.length])).length;
    const fams = [...new Set(known.map(s => s.crop))].map(cr => `${cr.name[LANG]}: ${cr.family}`).join("; ");
    const pl = [D.pest(segs.length, same)];
    if (fams) pl.push(D.pestFamilies(fams));
    if (segs.some(s => s.fallow)) pl.push(D.pestFallow);
    pl.push(D.pestDistinct(e.detail.distinctCrops), D.pestScore(n1(e.scores.pest)));
    crit("pest", pl);

    // Satılabilirlik
    if (e.scores.sell === null) crit("sell", [c.sell.length ? D.sellNoKnown : T.gapSell]);
    else {
      const inList = known.filter(s => c.sell.includes(s.crop.id));
      crit("sell", [D.sell(known.length, inList.length, this.names(inList.map(s => s.crop)), n1(e.scores.sell))]);
    }

    // Toplam: ağırlıklı ortalama, gerçek sayılarla
    const terms = [], weights = [];
    if (e.scores.climate !== null) { terms.push(`3 × ${n1(e.scores.climate)}`); weights.push(3); }
    if (e.scores.water !== null) { terms.push(`${c.prio.water} × ${n1(e.scores.water)}`); weights.push(c.prio.water); }
    terms.push(`${c.prio.soil} × ${n1(e.soil)}`); weights.push(c.prio.soil);
    if (e.scores.sell !== null) { terms.push(`${c.prio.income} × ${n1(e.scores.sell)}`); weights.push(c.prio.income); }
    const tot = add(root, "div", "od-crit od-total");
    add(tot, "p", "od-crit-head", `${T.scoreLabel}: ${n1(e.total)} / 5`);
    list(tot, [D.total(terms.join(" + "), weights.join(" + "), n1(e.total)), D.totalSoil(n1(e.scores.nitrogen), n1(e.scores.cover), n1(e.scores.pest), n1(e.soil)), D.totalRound]);

    // ---- b. Geçiş takvimi: bu rotasyonun yıl yıl ekim ve hasat ayları ----
    add(root, "h5", "od-h", D.calTitle);
    const mineRows = cur.ev.tl.rows, isMine = !option && !idea;
    const sameRow = r => mineRows.some(m => m.crop === r.crop && (m.name || "") === (r.name || "") && (r.crop === FALLOW || (m.sow === r.sow && m.harvest === r.harvest)));
    add(root, "p", "od-lead", isMine ? D.calOwn : D.calFrom(mineRows.map(r => Plan.periodText(r)).join(" → ")));
    const table = add(root, "table", "od-cal"), first = Math.floor(e.tl.first / 12) * 12;
    const yearOf = m => Math.floor((m - first) / 12) + 1;
    const row = (when, what, fresh) => {
      const tr = add(table, "tr", "");
      add(tr, "td", "od-when", when);
      const td = add(tr, "td", "", what);
      if (!isMine) { td.append(" "); add(td, "span", fresh ? "od-tag od-tag-new" : "od-tag", fresh ? D.tagNew : D.tagSame); }
    };
    segs.forEach(s => {
      const fresh = !sameRow(s.fallow ? { crop: FALLOW } : s.period);
      if (s.fallow) return row(D.calRange(yearOf(s.start), mon[s.start % 12], yearOf(s.end), mon[s.end % 12]), D.calFallow, fresh);
      const name = s.crop.name[LANG];
      row(D.calWhen(yearOf(s.start), mon[s.start % 12]), D.calSow(name), fresh);
      row(D.calWhen(yearOf(s.end), mon[s.end % 12]), D.calHarvest(name), fresh);
    });
    add(root, "p", "od-note", D.calRepeat(e.tl.months / 12, e.tl.bare, e.tl.months));
    if (!isMine) {
      const gone = mineRows.filter(m => !e.tl.rows.some(r => r.crop === m.crop && (r.name || "") === (m.name || ""))).map(m => (m.crop === FALLOW ? t("fallowShort") : m.crop === OTHER ? Rotation.otherCrop(m).name[LANG] : cropName(m.crop)));
      if (gone.length) add(root, "p", "od-note", D.calGone([...new Set(gone)].join(", ")));
      add(root, "p", "od-note", D.calStart);
    }

    // ---- c. Riskler ve bilgi boşlukları (karttaki cümlelerle aynı) ----
    add(root, "h5", "od-h", T.blockRisks);
    const risks = (idea ? it.newCrops.map(cr => T.riskNew(cr.name[LANG])) : []).concat(this.risks(e, c, option).map(r => r.text));
    list(root, risks.length ? risks : [T.none]);
    add(root, "h5", "od-h", T.blockGaps);
    const gaps = this.gaps(it.ev, ctx, option);
    list(root, gaps.length ? gaps : [T.none]);

    // ---- d. Yardım kutusu ----
    const help = add(root, "div", "od-help");
    add(help, "p", "od-help-title", D.helpTitle);
    add(help, "p", "", D.helpAdviser);
    const links = add(help, "ul", "od-list");
    HELP_LINKS.forEach(h => { const li = add(links, "li", ""), a = add(li, "a", "", h.name); a.href = h.url; a.target = "_blank"; a.rel = "noopener"; li.append(` — ${h.use[LANG]}`); });

    // ---- e. Tarla profili (prototip) ----
    const more = add(root, "p", "od-more");
    const btn = add(more, "a", "btn btn-primary", D.profileBtn);
    btn.href = "#profile";
    add(more, "span", "od-more-note", D.profileNote);
    return root;
  },

  // Kartta görünen (bir ondalığa yuvarlanmış) değer değişti mi?
  changed(a, b) {
    return a !== null && b !== null && b !== undefined && fmt(a, 1) !== fmt(b, 1);
  },

  // "3,4" ya da gelecek iklimde değiştiyse "3,4 → 3,7 ↑"
  valText(a, b) {
    if (a === null) return "–";
    return this.changed(a, b) ? `${fmt(a, 1)} → ${fmt(b, 1)} ${b > a ? "↑" : "↓"}` : fmt(a, 1);
  },

  // it: { ev (bugün), fut (gelecek iklim; kaydırıcılar sıfırsa null), option }; cur: mevcut rotasyonun aynı yapısı.
  // "Başka fikirler" kartında option yoktur; it.idea (sıra numarası) ve it.newCrops (çiftçinin rotasyonunda olmayan ürünler) vardır.
  card(it, ctx, fctx, cur) {
    const T = I18N[LANG].s3;
    const ev = it.ev, fut = it.fut, option = it.option, idea = it.idea || 0;
    const shown = fut || ev, shownCtx = fctx || ctx; // metinlerde kullanılan (ekrandaki iklime göre) hesap
    const card = document.createElement("article");
    card.className = "opt-card" + (idea ? " opt-idea" : option ? "" : " opt-current");
    const draft = Boolean(option && !option.crop.typicalMonthsApproved);
    card.innerHTML = `
      <p class="opt-kicker"></p>
      <h4 class="opt-title"></h4>
      <p class="opt-one"></p>
      <p class="opt-reorder" hidden></p>
      <p class="opt-draft" hidden></p>
      <div class="opt-strip-wrap"></div>
      <p class="opt-span"></p>
      <div class="opt-bars"></div>
      <p class="opt-total"><span class="opt-total-label"></span> <b class="opt-total-value"></b></p>
      <details class="science opt-how"><summary></summary><div class="opt-how-body"></div></details>
      <div class="opt-blocks"></div>
      <button type="button" class="btn btn-soft opt-inspect" aria-expanded="false"></button>
      <p class="opt-expert"></p>`;
    card.querySelector(".opt-inspect").dataset.detail = it.key;
    card.querySelector(".opt-inspect").textContent = T.inspect;
    card.querySelector(".opt-kicker").textContent = idea ? T.ideaKicker(idea) : option ? option.strategies.map(s => T.strategy[s]).join(" + ") : T.strategy.current;
    card.querySelector(".opt-title").textContent = this.title(ev.tl);
    card.querySelector(".opt-one").textContent = idea
      ? (it.newCrops.length ? T.ideaOneNew(this.names(it.newCrops)) : T.ideaOneSame)
      : option
      ? T.one[option.strategies[0]][option.kind](option.crop.name[LANG], option.replaced ? option.replaced.name[LANG] : null)
      : T.one.current;
    // Çiftçinin kendi kartında: aynı ürünlerle daha yüksek puanlı bir düzen var mı? (bugünün iklimine göre)
    // (it.plain: kart plan ekranının dışında, örneğin profil sayfasında gösteriliyor; bu satır yazılmaz)
    if (!option && !idea && !it.plain && this.state && this.state.reorder) {
      const line = card.querySelector(".opt-reorder");
      line.hidden = false;
      line.textContent = this.reorderText(this.state.reorder);
    }
    if (draft) { card.querySelector(".opt-draft").hidden = false; card.querySelector(".opt-draft").textContent = T.draft; }
    card.querySelector(".opt-strip-wrap").appendChild(this.strip(ev.tl));
    card.querySelector(".opt-span").textContent = I18N[LANG].rotationInfo({ years: ev.tl.months / 12, months: ev.tl.months, bare: ev.tl.bare });

    // Çubuk seçilen iklimdeki puanı gösterir; puan değiştiyse bugünkü değer ince bir çizgiyle işaretli kalır
    const bars = card.querySelector(".opt-bars");
    CRITERIA.forEach(k => {
      const v = ev.scores[k], f = fut ? fut.scores[k] : null;
      const moved = this.changed(v, f);
      const row = document.createElement("div");
      row.className = "opt-bar" + (moved ? " opt-bar-changed" : "");
      row.innerHTML = '<span class="opt-bar-name"></span><span class="opt-bar-track"><span class="opt-bar-fill"></span></span><span class="opt-bar-val"></span>';
      row.querySelector(".opt-bar-name").textContent = T.criteria[k];
      row.querySelector(".opt-bar-fill").style.width = v === null ? "0%" : `${((moved ? f : v) / 5) * 100}%`;
      if (moved) {
        const mark = document.createElement("span");
        mark.className = "opt-bar-mark";
        mark.style.left = `${(v / 5) * 100}%`;
        mark.title = T.futureMark(fmt(v, 1));
        row.querySelector(".opt-bar-track").appendChild(mark);
      }
      row.querySelector(".opt-bar-val").textContent = this.valText(v, f);
      bars.appendChild(row);
    });
    card.querySelector(".opt-total-label").textContent = `${T.scoreLabel}:`;
    card.querySelector(".opt-total-value").textContent = `${this.valText(ev.total, fut ? fut.total : null)} / 5`;
    card.querySelector(".opt-total").classList.toggle("opt-total-changed", Boolean(fut) && this.changed(ev.total, fut.total));

    // "Nasıl hesaplandı?": ölçütler ve ağırlıklar sade dille
    card.querySelector(".opt-how summary").textContent = T.how;
    const how = card.querySelector(".opt-how-body");
    CRITERIA.forEach(k => {
      const p = document.createElement("p");
      p.textContent = `${T.criteria[k]} (${this.valText(ev.scores[k], fut ? fut.scores[k] : null)}): ${T.howText[k]}`;
      how.appendChild(p);
    });
    const w = document.createElement("p");
    w.textContent = T.howWeights(ctx.prio.water, ctx.prio.soil, ctx.prio.income, ev.scores.sell === null);
    how.appendChild(w);

    const blocks = card.querySelector(".opt-blocks");
    const block = (label, items) => {
      const h = document.createElement("p");
      h.className = "opt-block-label";
      h.textContent = label;
      blocks.append(h, this.list(items));
    };
    if (option) {
      block(T.blockWhy, this.why(option));
      block(T.blockVersus, this.versus(shown, cur.fut || cur.ev, option.strategies[0] === "other"));
    } else if (idea) {
      block(T.blockVersus, this.versus(shown, cur.fut || cur.ev, true)); // fikir bir öneri değil, karşılaştırmadır
    }
    // Kanıt bugünün verisidir; kaydırıcılar açıkken hesapta kullanılan yağış ayrıca yazılır
    const evidence = this.evidence(ev, ctx, option);
    if (fctx) evidence.push(T.evFuture(fmt(fctx.rain), fmt(ctx.rain), Future.dT !== 0 && fctx.et0Ratio > 1));
    block(T.blockEvidence, evidence);
    block(T.blockGaps, this.gaps(ev, ctx, option));

    // Riskler ekrandaki iklime göre; bugün olmayıp gelecek iklimde çıkan risk "yeni" etiketi alır
    // Fikir kartında, çiftçinin rotasyonunda olmayan her ürün için "önce küçük bir parselde deneyin" riski yazılır.
    const risksOf = (e, c) => (idea ? it.newCrops.map(cr => ({ key: `new:${cr.id}`, text: T.riskNew(cr.name[LANG]) })) : []).concat(this.risks(e, c, option));
    const today = risksOf(ev, ctx);
    const known = new Set(today.map(r => r.key));
    block(T.blockRisks, fut ? risksOf(fut, fctx).map(r => ({ text: r.text, isNew: !known.has(r.key) })) : today.map(r => r.text));

    block(T.blockSoil, this.soilTrend(ev, cur.ev, !option && !idea)); // açıklama notu kartların altında bir kez yazılır (#soilNote)

    card.querySelector(".opt-expert").textContent = T.expert;
    return card;
  },

  // Hesap bağlamı: iklim verisi + formdaki yanıtlar. İklim verisi eksikse null döner. (Profil sayfası da kullanır.)
  context(answers, d) {
    const usable = d && d.tminYears && d.rain.length && d.monthRain.every(v => v !== null);
    return usable ? {
      d, rain: d.rain.reduce((a, b) => a + b, 0) / d.rain.length,
      water: answers.water, slope: answers.slope, soil: answers.soil, sell: answers.sell, prio: answers.prio
    } : null;
  },

  // periods: tamamlanmış dönemler; answers: formdaki yanıtlar; d: iklim verisi
  render(periods, answers, d) {
    const ctx = this.context(answers, d);
    const result = ctx ? Rotation.alternatives(periods, ctx) : { current: null, options: [] };
    this.state = result.current ? { periods, ctx, result } : null;
    // Yeni hesapta inceleme paneli kapanır; yalnızca aynı rotasyon yine ekrandaysa (ör. dil değişimi) açık kalır
    this.detailKeep = this.detailKey && result.current ? this.detailSig : null;
    this.detailKey = null;
    // "Başka fikirler": kartlarda zaten görünen ürün kümeleri dışında, en çok 3 fikir (bugünün iklimine göre seçilir)
    if (this.state) {
      const st = this.state, tenth = v => Math.round(v * 10);
      st.ideas = Rotation.ideas(ctx, [result.current, ...result.options.map(o => o.ev)].map(e => Rotation.cropKey(e)));
      st.reorder = Rotation.bestOrder(periods, ctx);
      // Stratejiler sonuç üretmediyse kartların üstündeki cümle: bir fikir mevcut rotasyonu (kartta görünen puanla)
      // geçiyorsa nötr, hiçbiri geçmiyorsa olumlu
      st.headline = result.found > 0 ? null : st.ideas.some(x => tenth(x.ev.total) > tenth(result.current.total)) ? "neutral" : "strong";
      // Ana kart sayısı (çiftçinin kartı dahil) 3'ün altındaysa "Başka fikirler" açık başlar; değilse kapalı
      el("ideasBox").open = 1 + result.options.length < 3;
    }
    el("planOptions").hidden = !result.current;
    if (!result.current) { el("optionCards").innerHTML = ""; Future.renderSticky(); return null; }
    this.draw();
    return result;
  },

  // Kartları ve "gelecek iklim" kutusunu son hesaptan yeniden çizer (kaydırıcılar oynayınca da çağrılır).
  // Kartlardaki rotasyonlar bugünün iklimine göre seçilmiş hâliyle kalır.
  draw() {
    if (!this.state) return;
    const { ctx, result, ideas } = this.state;
    const T = I18N[LANG].s3;
    const box = el("optionCards"), note = el("optionNote");
    const fctx = Future.active() ? Future.context(ctx) : null;
    const items = [{ ev: result.current, option: null }, ...result.options.map(o => ({ ev: o.ev, option: o }))];
    items.forEach((it, i) => { it.fut = fctx ? Rotation.evaluate(it.ev.tl.rows, fctx) : null; it.key = `m${i}`; });
    this.items = items;
    // "Bu seçeneği incele" paneli için: düğme anahtarı → kartın verisi
    this.detailItems = {};
    items.forEach(it => { this.detailItems[it.key] = { it, ctx, fctx, cur: items[0] }; });
    if (!this.detailBound) {
      this.detailBound = true;
      el("planOptions").addEventListener("click", ev => { const b = ev.target.closest("[data-detail]"); if (b) this.toggleDetail(b.dataset.detail); });
    }

    box.innerHTML = "";
    items.forEach(it => box.appendChild(this.card(it, ctx, fctx, items[0])));
    this.sectioned(el("optionScience"), T.science, T.scienceHeads);
    el("soilNote").textContent = T.soil.note;

    // "Başka fikirler": her zaman görünen, başta kapalı bölüm. Kartlar da seçilen iklimle yeniden puanlanır.
    const mine = new Set(result.current.crops.map(s => s.crop.id)), ideaBox = el("ideaCards");
    el("ideasSummary").textContent = T.ideasSummary(ideas.length);
    el("ideasTitle").textContent = T.ideasTitle;
    el("ideasLead").textContent = ideas.length ? T.ideasLead : T.ideasNone;
    el("ideasUnknown").hidden = !ideas.length;
    el("ideasUnknown").textContent = T.ideasUnknown;
    ideaBox.innerHTML = "";
    ideas.forEach((x, i) => {
      const newCrops = [...new Set(x.ev.crops.map(s => s.crop))].filter(c => !mine.has(c.id));
      const it = { ev: x.ev, fut: fctx ? Rotation.evaluate(x.rows, fctx) : null, option: null, idea: i + 1, newCrops, key: `i${i + 1}` };
      this.detailItems[it.key] = { it, ctx, fctx, cur: items[0] };
      ideaBox.appendChild(this.card(it, ctx, fctx, items[0]));
    });
    // Stratejiler rotasyonu iyileştiremediyse kartların üstünde bir cümle: hiçbir kart mevcut rotasyonu
    // geçmiyorsa olumlu, bir "Başka bir olasılık" kartı geçiyorsa nötr (bugünün iklimine göre)
    note.hidden = !this.state.headline;
    note.textContent = this.state.headline === "neutral" ? T.neutral : T.strong;
    // Yedek kartlarla da üç kart çıkmadıysa (hiç geçerli hamle yoksa) eksik kartın yerinde nedenini yaz
    if (result.options.length < 2) box.appendChild(this.emptyCard(result));
    this.futureBox(items, fctx);
    if (this.detailKeep) { // yeni hesaptan önce açık olan rotasyon yine ekrandaysa paneli onunla aç
      this.detailKey = Object.keys(this.detailItems).find(k => Rotation.signature(this.detailItems[k].it.ev.tl.rows) === this.detailKeep) || null;
      this.detailKeep = null;
    }
    this.renderDetail(); // açık bir inceleme paneli varsa yeni sayılarla yeniden yazılır
  },

  // Kaydırıcı kutusunun metinleri: seçilen değerler, "Yani" cümlesi, buharlaşma uyarısı, alternatif notu
  futureBox(items, fctx) {
    const T = I18N[LANG].s3, { ctx, result, periods } = this.state;
    el("futureTempVal").textContent = T.tempVal(Future.dT);
    el("futureRainVal").textContent = T.rainVal(Future.dP);
    el("futureReset").disabled = !fctx;
    el("futureBox").classList.toggle("future-on", Boolean(fctx));

    const tenth = v => Math.round(v * 10);
    let yani = T.futureIdle;
    if (fctx) {
      const any = items.some(it => this.changed(it.ev.total, it.fut.total) || CRITERIA.some(k => this.changed(it.ev.scores[k], it.fut.scores[k])));
      if (!any) yani = T.futureNoChange;
      else {
        const parts = [];
        CRITERIA.forEach(k => {
          const moved = items.filter(it => this.changed(it.ev.scores[k], it.fut.scores[k]));
          const up = moved.filter(it => it.fut.scores[k] > it.ev.scores[k]).length;
          if (moved.length) parts.push(T.futureCrit(T.criteria[k], up, moved.length - up));
        });
        // En yüksek puanlı kart(lar), kartta görünen yuvarlanmış puana göre
        const top = key => {
          const best = Math.max(...items.map(it => tenth(it[key].total)));
          return items.filter(it => tenth(it[key].total) === best);
        };
        const now = top("ev"), then = top("fut");
        const names = list => list.map(it => this.title(it.ev.tl)).join(" / ") + (list.length > 1 ? T.futureTied : "");
        const same = now.length === then.length && now.every(it => then.includes(it));
        parts.push(same ? T.futureTopSame(names(then)) : T.futureTopNew(names(then), names(now)));
        // Isınma toplam puanı yükseltiyorsa (soğuk aylar "uygun"a yaklaştığı için) açıkça söyle
        // "Kış ayları" yalnızca kışı olan yerde denir: dönenceler dışında (enlem 23,5°'den büyük) ve ekibin
        // "kış" kuralına göre (en soğuk ay 15°C'nin altında). Dönenceler arasındaki serin yerlerde
        // (ör. ekvatordaki yaylalar) "serin aylar" denir.
        if (Future.dT > 0 && items.some(it => tenth(it.fut.total) > tenth(it.ev.total) && it.fut.scores.climate > it.ev.scores.climate + 1e-9)) {
          parts.push(Math.abs(Field.lat) > 23.5 && Rotation.winterSowMonths(ctx.d).length ? T.futureCold : T.futureCool);
        }
        // Yağış azalınca su puanı yükseliyorsa nedeni yazılır: bugünkü yağış bir ürünün ideal aralığının
        // üstündeydi ve seçilen iklimde o ürünün su puanı arttı (ör. Nakuru: 1305 mm, mısırın ideali en çok 1200 mm).
        // Yalnızca yağış kaydırıcısı eksiyken çıkar (ekip kararı); ürünlerin adı cümlede sayılır.
        if (Future.dP < 0) {
          const over = new Set();
          items.filter(it => this.changed(it.ev.scores.water, it.fut.scores.water) && it.fut.scores.water > it.ev.scores.water)
            .forEach(it => it.ev.crops.forEach((s, i) => { if (ctx.rain > s.crop.ropmx && it.fut.crops[i].water > s.water) over.add(s.crop.name[LANG].toLocaleLowerCase(LANG)); }));
          if (over.size) {
            const list = [...over];
            const names = typeof Intl !== "undefined" && Intl.ListFormat ? new Intl.ListFormat(LANG, { type: "conjunction" }).format(list) : list.join(", ");
            parts.push(T.futureLessRain(names));
          }
        }
        yani = T.futureYani(T.futureScenario(Future.dT, Future.dP), parts.join(" "));
      }
    }
    el("futureYani").textContent = yani;

    el("futureWarn").hidden = Future.dT === 0;
    el("futureWarn").textContent = T.futureWarn;

    // Kartlar sabit; gelecek iklimde kurallar başka bir alternatifi öne çıkarıyorsa tek satır not
    let alt = "";
    if (fctx) {
      const best = list => list.slice().sort((a, b) => b.ev.total - a.ev.total)[0];
      const sig = o => Rotation.signature(o.ev.tl.rows);
      const future = best(Rotation.alternatives(periods, fctx).options), today = best(result.options);
      if (future && (!today || sig(future) !== sig(today))) {
        const onCards = result.options.some(o => sig(o) === sig(future));
        // Kartlarda olmayan rotasyon aylarıyla yazılır (aynı ürünler başka aylarda da olabilir)
        alt = onCards ? T.futureAltShown(this.title(future.ev.tl)) : T.futureAltOther(future.ev.tl.rows.map(r => Plan.periodText(r)).join(" → "));
      }
    }
    el("futureAlt").hidden = !alt;
    el("futureAlt").textContent = alt;

    const et0 = Future.et0Year(ctx.d, 0);
    this.sectioned(el("futureScience"), T.futureScience(et0 === null ? null : fmt(et0),
      fctx && Future.dT !== 0 && et0 !== null ? fmt((fctx.et0Ratio - 1) * 100, 1) : null, Future.dT), T.futureScienceHeads);
    Future.renderSticky();
  },

  emptyCard(result) {
    const T = I18N[LANG].s3, w = result.why;
    const card = document.createElement("article");
    card.className = "opt-card opt-empty";
    card.innerHTML = '<p class="opt-kicker"></p><p class="opt-one"></p><div class="opt-blocks"></div>';
    card.querySelector(".opt-kicker").textContent = T.emptyTitle;
    card.querySelector(".opt-one").textContent = result.options.length === 0 ? T.noneFound : T.oneFound;
    const reasons = [];
    w.merged.forEach(names => reasons.push(T.emptyMerged(names.map(s => T.strategy[s]).join(", "))));
    if (w.soil) reasons.push(w.singleCrop ? T.emptySoilSingle : T.emptySoil);
    if (w.water) reasons.push(T.emptyWater);
    if (w.market) reasons.push(w.noSell ? T.emptyMarketNoSell : w.singleCrop ? T.emptyMarketSingle : T.emptyMarket);
    card.querySelector(".opt-blocks").appendChild(this.list(reasons));
    return card;
  }
};
