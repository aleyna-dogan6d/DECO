// AI disclosure: written with AI assistance (Anthropic Claude, via Claude Code); reviewed and edited by the DECO team.
// Tarla takvimi: seçilen yerin tipik bir yılı (12 ay).
// Yalnızca NASA POWER'ın 2001–2024 aylık ortalamalarını gösterir; ürüne göre ekim penceresi
// ürün listesi geldiğinde bunun üstüne eklenecek.

const Calendar = {
  // Art arda 3 ayın toplamı, "pick" ölçütüne göre en uç olan pencereyi bulur (yıl sonundan başa sarar)
  window3(values, pick) {
    let start = 0, sum = null;
    for (let i = 0; i < 12; i++) {
      const s = values[i] + values[(i + 1) % 12] + values[(i + 2) % 12];
      if (sum === null || pick(s, sum)) { start = i; sum = s; }
    }
    return { start, sum };
  },

  // Sıcaklığa göre kutu rengi: -5°C ve altı mavi, 35°C ve üstü kırmızı (yalnızca görsel yardım)
  tempColor(temp) {
    const hue = Math.max(10, Math.min(220, 220 - ((temp + 5) / 40) * 210));
    return `hsl(${Math.round(hue)} 75% 86%)`;
  },

  stats(d) {
    const names = t("months").map(m => m.slice(0, 3));
    const span = w => `${names[w.start]}–${names[(w.start + 2) % 12]}`;
    const total = d.monthRain.reduce((a, b) => a + b, 0);
    const wet = this.window3(d.monthRain, (a, b) => a > b);
    const dry = this.window3(d.monthRain, (a, b) => a < b);
    return {
      wet: span(wet),
      dry: span(dry),
      wetMm: fmt(wet.sum),
      dryMm: fmt(dry.sum),
      share: fmt(total > 0 ? (wet.sum / total) * 100 : 0),
      frostAll: d.frostMonths.every(Boolean),
      frost: monthRanges(d.frostMonths),
      frostFree: monthRanges(d.frostMonths.map(f => !f))
    };
  },

  render(d) {
    const grid = el("calGrid");
    grid.innerHTML = "";
    const complete = d && [d.monthRain, d.monthTemp, d.monthTmin].every(a => a && a.every(v => v !== null));
    el("calBody").hidden = !complete;
    if (!complete) { el("calLead").textContent = t("climateError"); return; }

    const maxRain = Math.max(...d.monthRain, 1);
    t("months").forEach((month, i) => {
      const col = document.createElement("div");
      col.className = "cal-col";
      col.title = I18N[LANG].calTip(month, fmt(d.monthTemp[i], 1), fmt(d.monthTmin[i], 1), fmt(d.monthRain[i]));
      col.innerHTML = `
        <div class="cal-rain"><span class="cal-rain-val"></span><div class="cal-bar"></div></div>
        <div class="cal-temp"></div>
        <div class="cal-frost"></div>
        <div class="cal-month"></div>`;
      col.querySelector(".cal-rain-val").textContent = fmt(d.monthRain[i]);
      col.querySelector(".cal-bar").style.height = `${Math.max(2, (d.monthRain[i] / maxRain) * 100)}%`;
      const temp = col.querySelector(".cal-temp");
      temp.textContent = `${fmt(Math.round(d.monthTemp[i]) + 0)}°`; // "+ 0": -0,4 gibi değerler "-0" değil "0" görünsün
      temp.style.background = this.tempColor(d.monthTemp[i]);
      if (d.frostMonths[i]) {
        const frost = col.querySelector(".cal-frost");
        frost.textContent = "❄";
        frost.setAttribute("aria-label", t("factFrost"));
      }
      col.querySelector(".cal-month").textContent = month.slice(0, 3);
      grid.appendChild(col);
    });

    const s = this.stats(d);
    el("calLead").textContent = I18N[LANG].calLead(s);
    el("calYani").textContent = I18N[LANG].calYani(s);
  },

  // ---------- Ürüne göre aylar ----------
  // Eğilim gösteren basitleştirilmiş model; gerçek bir bitki modeli değildir. Kurallar (ekip kararları K8, K8b):
  //  Sıcaklık: ayın ortalama sıcaklığı ürünün en iyi aralığındaysa "good", dayanabildiği aralıktaysa "edge",
  //            dışındaysa "bad" (reason: cold / hot).
  //  Don:      ürünün öldürücü sıcaklığı (ktmp) biliniyorsa, ay yılların en az %20'sinde o sıcaklığın altına
  //            düştüyse "bad". Bilinmiyorsa ekibin "dona dayanıklı mı" bilgisi kullanılır: dayanıksız üründe
  //            don riskli (0°C altı, aynı %20 kuralı) ay "bad". (reason: frost)
  //  Kış beklemesi: ekibin "kışlık ekilebilir" dediği üründe (winterCrop) ay fazla soğuksa ama don kuralına göre
  //            öldürücü değilse "bad" değil "wait" sayılır: bitki büyümeyi durdurup bekler.
  //            Bu ürünlerde ekip "dona dayanıklı" bilgisi verdiyse, tabloda ktmp olsa bile ekip bilgisi kullanılır.
  //  Yağış aylara göre değil, yıllık toplam üzerinden ayrıca değerlendirilir (rainLevel).
  cropMonths(crop, d) {
    // Kışlık ekilebilen ürünlerde (winterCrop) ECOCROP'un tek öldürücü sıcaklık değeri yerine ekibin
    // "dona dayanıklı" bilgisi kullanılır: kışlık tahıllar sonbaharda soğuğa alışır (ekip kararı, 14 Kasım 2026).
    const useTeam = crop.frostHardy !== null && (crop.ktmp === null || crop.winterCrop);
    const kill = useTeam ? (crop.frostHardy === false ? d.frostMonths : Array(12).fill(false))
      : crop.ktmp !== null ? coldRiskMonths(d, crop.ktmp)
      : Array(12).fill(false);
    return d.monthTemp.map((temp, i) => {
      if (kill[i]) return { status: "bad", reason: "frost" };
      if (temp < crop.tmin) return crop.winterCrop ? { status: "wait", reason: null } : { status: "bad", reason: "cold" };
      if (temp > crop.tmax) return { status: "bad", reason: "hot" };
      return { status: temp >= crop.topmn && temp <= crop.topmx ? "good" : "edge", reason: null };
    });
  },

  // Ekimden hasada kadar (ikisi de dahil) ürünün tarlada olduğu aylar: 0–11
  periodMonths(p) {
    const n = ((p.harvest - p.sow + 12) % 12) + 1;
    return Array.from({ length: n }, (_, k) => (p.sow - 1 + k) % 12);
  },

  // Tarlada n ay kalan bir ürün için, hiçbir ayı "bad" olmayan ekim ayları (kış beklemesi ayları dönemi bozmaz)
  sowWindows(months, n) {
    const starts = [];
    for (let s = 0; s < 12; s++) {
      let ok = true;
      for (let k = 0; k < n && ok; k++) ok = months[(s + k) % 12].status !== "bad";
      if (ok) starts.push(s);
    }
    return starts;
  },

  // Yerin yıllık yağışı ürünün yıllık aralığının neresinde (FAO ECOCROP yağış değerleri yıllıktır)
  rainLevel(crop, rain) {
    if (rain < crop.rmin) return "low";
    if (rain < crop.ropmn) return "lowish";
    if (rain <= crop.ropmx) return "ok";
    if (rain <= crop.rmax) return "highish";
    return "high";
  },

  // Rotasyondaki her dönem için bir şerit ve açıklama çizer
  renderCrops(periods, d, water) {
    const box = el("cropCalList");
    box.innerHTML = "";
    const usable = d && d.tminYears && d.monthTemp.every(v => v !== null) && d.rain.length;
    el("cropCal").hidden = !(usable && periods.length);
    if (el("cropCal").hidden) return;

    const names = t("months").map(m => m.slice(0, 3));
    const symbols = { good: "✓", edge: "~", wait: "z", bad: "✕" };
    const yearlyRain = d.rain.reduce((a, b) => a + b, 0) / d.rain.length;

    periods.forEach(p => {
      if (p.crop === OTHER) {
        // Listede olmayan ürün: verimiz yok, aylara göre uygunluk gösterilemez (yalnızca not yazılır)
        const name = Rotation.otherCrop(p).name[LANG];
        const note = document.createElement("div");
        note.className = "crop-cal crop-cal-other";
        note.innerHTML = '<p class="crop-cal-title"></p><p class="crop-cal-text"></p>';
        note.querySelector(".crop-cal-title").textContent = I18N[LANG].cropCalTitle(name, t("months")[p.sow - 1], t("months")[p.harvest - 1]);
        note.querySelector(".crop-cal-text").textContent = I18N[LANG].otherCalNote(name);
        box.appendChild(note);
        return;
      }
      const crop = CROPS.find(c => c.id === p.crop);
      if (!crop) return;
      const months = this.cropMonths(crop, d);
      const inField = this.periodMonths(p);

      const block = document.createElement("div");
      block.className = "crop-cal";
      block.innerHTML = '<p class="crop-cal-title"></p><div class="cal crop-strip"></div><p class="crop-cal-text"></p><p class="crop-cal-text"></p>';
      block.querySelector(".crop-cal-title").textContent = I18N[LANG].cropCalTitle(crop.name[LANG], t("months")[p.sow - 1], t("months")[p.harvest - 1]);

      const strip = block.querySelector(".crop-strip");
      months.forEach((m, i) => {
        const col = document.createElement("div");
        col.className = "cal-col";
        col.innerHTML = '<div class="cs-cell"></div><div class="cal-month"></div>';
        const cell = col.querySelector(".cs-cell");
        cell.classList.add(`cs-${m.status}`);
        if (!inField.includes(i)) cell.classList.add("cs-out");
        cell.textContent = symbols[m.status];
        col.title = `${t("months")[i]}: ${t("cropStatus")[m.status]}`;
        col.querySelector(".cal-month").textContent = names[i];
        strip.appendChild(col);
      });

      const count = status => inField.filter(i => months[i].status === status).length;
      const why = reason => monthRanges(months.map((m, i) => inField.includes(i) && m.reason === reason));
      const texts = block.querySelectorAll(".crop-cal-text");
      texts[0].textContent = I18N[LANG].cropCalText({
        crop: crop.name[LANG],
        n: inField.length, good: count("good"), edge: count("edge"), wait: count("wait"), bad: count("bad"),
        cold: why("cold"), hot: why("hot"), frost: why("frost"),
        waitMonths: monthRanges(months.map((m, i) => inField.includes(i) && m.status === "wait")),
        windows: this.sowWindows(months, inField.length).map(s => names[s])
      });
      texts[1].textContent = I18N[LANG].cropRainText({
        crop: crop.name[LANG], rain: fmt(yearlyRain), rmin: fmt(crop.rmin), ropmn: fmt(crop.ropmn),
        ropmx: fmt(crop.ropmx), rmax: fmt(crop.rmax), level: this.rainLevel(crop, yearlyRain), water
      });
      box.appendChild(block);
    });
  }
};
