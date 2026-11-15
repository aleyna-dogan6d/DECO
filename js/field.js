// Seçilen tarla: yer adı, NASA POWER iklim özeti, halk dilinde özet ve grafik.
// Ayrıca yer arama (OpenStreetMap Nominatim) burada.

const POWER_BASE = "https://power.larc.nasa.gov/api/temporal/monthly/point";
const NOMINATIM = "https://nominatim.openstreetmap.org";
const YEARS = [2001, 2024];

// İşaretli ayları "Kas–Mar" gibi aralıklara çevirir (yıl sonundan başa sarabilir).
// Hiç işaretli ay yoksa null, hepsi işaretliyse "Tüm yıl" döner.
function monthRanges(flags) {
  if (!flags.some(Boolean)) return null;
  if (flags.every(Boolean)) return t("allYear");
  const names = t("months").map(m => m.slice(0, 3));
  const start = flags.findIndex((f, i) => f && !flags[(i + 11) % 12]);
  const ranges = [];
  for (let n = 0; n < 12; n++) {
    const i = (start + n) % 12;
    if (flags[i] && !flags[(i + 11) % 12]) ranges.push([i, i]);
    else if (flags[i]) ranges[ranges.length - 1][1] = i;
  }
  return ranges.map(([a, b]) => (a === b ? names[a] : `${names[a]}–${names[b]}`)).join(", ");
}

// Don kuralının genel hâli: bir ayda en düşük sıcaklık, yılların en az %20'sinde "threshold" derecenin
// altına düştüyse o ay riskli sayılır. threshold = 0 için sonuç frostMonths ile aynıdır.
function coldRiskMonths(d, threshold) {
  return d.tminYears.map(a => (a.length ? a.filter(v => v < threshold).length / a.length >= 0.2 : false));
}

const Field = {
  lat: null,
  lng: null,
  name: null,
  data: null,        // { years, rain[], temp[], monthTemp[12], frostMonths[] }
  chart: null,
  chartKind: "rain",
  activeYear: null,
  token: 0,          // eski isteklerin sonucunu yok saymak için
  cache: {},

  async select(lat, lng, name = null) {
    const my = ++this.token;
    this.lat = lat;
    this.lng = ((lng + 540) % 360) - 180; // haritada dünya etrafında dönülmüşse düzelt
    this.name = name;
    this.data = null;

    el("hintCard").hidden = true;
    el("fieldCard").hidden = false;
    el("facts").hidden = true;
    el("chartWrap").hidden = true;
    el("fieldYani").textContent = "";
    el("fieldName").textContent = name || "…";
    el("fieldCoords").textContent = `${fmt(lat, 3)}°, ${fmt(this.lng, 3)}°`;
    el("fieldStatus").textContent = t("loadingClimate");

    if (!name) this.reverseGeocode(my);

    try {
      const data = await this.loadClimate(lat, this.lng);
      if (my !== this.token) return;
      this.data = data;
      el("fieldStatus").textContent = "";
      this.render();
    } catch (e) {
      if (my !== this.token) return;
      console.warn("POWER yüklenemedi", e);
      el("fieldStatus").textContent = t("climateError");
    }
  },

  close() {
    this.token++;
    this.lat = this.lng = null;
    el("fieldCard").hidden = true;
    el("hintCard").hidden = false;
    MapView.clearPin();
  },

  async reverseGeocode(my) {
    try {
      const url = `${NOMINATIM}/reverse?format=json&zoom=10&accept-language=${LANG}&lat=${this.lat}&lon=${this.lng}`;
      const j = await fetch(url).then(r => r.json());
      if (my !== this.token) return;
      const a = j.address || {};
      const local = a.village || a.town || a.city || a.municipality || a.county || a.state_district || a.state;
      this.name = [local, a.country].filter(Boolean).join(", ") || t("selectedPoint");
    } catch {
      if (my !== this.token) return;
      this.name = t("selectedPoint");
    }
    el("fieldName").textContent = this.name;
  },

  // NASA POWER: aylık sıcaklık (T2M), aylık en düşük sıcaklık (T2M_MIN) ve yağış (PRECTOTCORR, mm/gün)
  async loadClimate(lat, lng) {
    const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
    if (this.cache[key]) return this.cache[key];
    // T2M_RANGE (günlük sıcaklık farklarının aylık ortalaması) ve TOA_SW_DWN (dünya dışı radyasyon, MJ/m²/gün)
    // Aşama 4'te FAO-56 Hargreaves denklemiyle referans buharlaşmayı hesaplamak için alınır.
    const url = `${POWER_BASE}?parameters=T2M,T2M_MIN,PRECTOTCORR,T2M_RANGE,TOA_SW_DWN&community=AG` +
      `&latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&start=${YEARS[0]}&end=${YEARS[1]}&format=JSON`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const p = (await res.json()).properties.parameter;
    const data = this.summarize(p);
    this.cache[key] = data;
    return data;
  },

  summarize(p) {
    const years = [];
    const rain = [], temp = [];
    const monthTemps = Array.from({ length: 12 }, () => []);
    const monthRains = Array.from({ length: 12 }, () => []);   // her ayın toplam yağışı (mm), yıl yıl
    const monthTmins = Array.from({ length: 12 }, () => []);   // her ayın en düşük sıcaklığı, yıl yıl
    const monthRanges_ = Array.from({ length: 12 }, () => []); // günlük sıcaklık farkı (T2M_RANGE), yıl yıl
    const monthRas = Array.from({ length: 12 }, () => []);     // dünya dışı radyasyon (TOA_SW_DWN), yıl yıl
    const frostCount = Array(12).fill(0), monthCount = Array(12).fill(0);
    const ok = v => typeof v === "number" && v > -900; // -999 = eksik veri

    for (let y = YEARS[0]; y <= YEARS[1]; y++) {
      let r = 0, ts = [], complete = true;
      for (let m = 1; m <= 12; m++) {
        const k = `${y}${String(m).padStart(2, "0")}`;
        const pr = p.PRECTOTCORR[k], tm = p.T2M[k], tmin = p.T2M_MIN[k];
        const days = new Date(y, m, 0).getDate();
        if (ok(pr)) { r += pr * days; monthRains[m - 1].push(pr * days); } else complete = false;
        if (ok(tm)) { ts.push(tm); monthTemps[m - 1].push(tm); }
        if (ok(tmin)) { monthCount[m - 1]++; monthTmins[m - 1].push(tmin); if (tmin < 0) frostCount[m - 1]++; }
        if (p.T2M_RANGE && ok(p.T2M_RANGE[k])) monthRanges_[m - 1].push(p.T2M_RANGE[k]);
        if (p.TOA_SW_DWN && ok(p.TOA_SW_DWN[k])) monthRas[m - 1].push(p.TOA_SW_DWN[k]);
      }
      if (complete && ts.length === 12) {
        years.push(y);
        rain.push(Math.round(r));
        temp.push(Math.round((ts.reduce((a, b) => a + b, 0) / 12) * 10) / 10);
      }
    }

    const avg = a => a.reduce((s, v) => s + v, 0) / a.length;
    const monthTemp = monthTemps.map(a => (a.length ? avg(a) : null));
    const monthRain = monthRains.map(a => (a.length ? avg(a) : null));
    const monthTmin = monthTmins.map(a => (a.length ? avg(a) : null));
    // Yılların en az %20'sinde ay içinde sıcaklık 0°C'nin altına düştüyse o ayı "don riski var" sayıyoruz
    const frostMonths = frostCount.map((c, i) => (monthCount[i] ? c / monthCount[i] >= 0.2 : false));
    const monthRange = monthRanges_.map(a => (a.length ? avg(a) : null));
    const monthRa = monthRas.map(a => (a.length ? avg(a) : null));
    return { years, rain, temp, monthTemp, monthRain, monthTmin, frostMonths, tminYears: monthTmins, monthRange, monthRa };
  },

  render() {
    const d = this.data;
    if (!d || d.years.length < 10) { el("fieldStatus").textContent = t("climateError"); return; }
    const avg = a => a.reduce((s, v) => s + v, 0) / a.length;

    el("factRain").textContent = `${fmt(avg(d.rain))} mm`;
    const hot = d.monthTemp.indexOf(Math.max(...d.monthTemp));
    el("factHot").textContent = `${t("months")[hot]} · ${fmt(d.monthTemp[hot])}°C`;
    el("factFrost").textContent = this.frostText(d.frostMonths);
    el("facts").hidden = false;

    const r0 = avg(d.rain.slice(0, 5)), r1 = avg(d.rain.slice(-5));
    const t0 = avg(d.temp.slice(0, 5)), t1 = avg(d.temp.slice(-5));
    el("fieldYani").textContent = I18N[LANG].yani(Math.round(((r1 - r0) / r0) * 100), Math.round((t1 - t0) * 10) / 10);

    el("chartWrap").hidden = false;
    this.drawChart();
  },

  frostText(flags) {
    return monthRanges(flags) || t("noFrost");
  },

  drawChart() {
    const d = this.data;
    if (!d) return;
    const rainKind = this.chartKind === "rain";
    const color = rainKind ? "#5b9bd5" : "#e07a4f";
    if (this.chart) this.chart.destroy();
    this.chart = new Chart(el("fieldChart"), {
      type: rainKind ? "bar" : "line",
      data: {
        labels: d.years,
        datasets: [{
          label: rainKind ? t("chartRain") : t("chartTemp"),
          data: rainKind ? d.rain : d.temp,
          backgroundColor: rainKind ? this.barColors() : color,
          borderColor: color,
          borderWidth: rainKind ? 0 : 2.5,
          borderRadius: 4,
          pointRadius: rainKind ? 0 : d.years.map(y => (y === this.activeYear ? 5 : 0)),
          pointBackgroundColor: "#1f6f43",
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        animation: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: c => `${fmt(c.parsed.y, rainKind ? 0 : 1)} ${rainKind ? "mm" : "°C"}` } }
        },
        scales: {
          x: { ticks: { color: "#5f6b64", maxTicksLimit: 6 }, grid: { display: false } },
          y: { ticks: { color: "#5f6b64", maxTicksLimit: 5 }, grid: { color: "#eef1ee" }, beginAtZero: rainKind }
        }
      }
    });
  },

  barColors() {
    return this.data.years.map(y => (y === this.activeYear ? "#1f6f43" : "#9cc3e6"));
  },

  setYear(y) {
    if (y === this.activeYear) return;
    this.activeYear = y;
    if (!this.chart || !this.data) return;
    const ds = this.chart.data.datasets[0];
    if (this.chartKind === "rain") ds.backgroundColor = this.barColors();
    else ds.pointRadius = this.data.years.map(v => (v === y ? 5 : 0));
    this.chart.update("none");
  },

  setChartKind(kind) {
    this.chartKind = kind;
    document.querySelectorAll(".seg-btn").forEach(b => b.classList.toggle("active", b.dataset.chart === kind));
    this.drawChart();
  },

  refreshLanguage() {
    if (this.lat === null) return;
    el("fieldCoords").textContent = `${fmt(this.lat, 3)}°, ${fmt(this.lng, 3)}°`;
    if (this.data) this.render();
  }
};

// ---------- Yer arama ----------
const Search = {
  timer: null,
  results: [],
  active: -1,

  init() {
    const input = el("searchInput");
    input.addEventListener("input", () => {
      clearTimeout(this.timer);
      const q = input.value.trim();
      if (q.length < 2) return this.hide();
      this.timer = setTimeout(() => this.query(q), 450); // Nominatim kuralı: saniyede en fazla 1 istek
    });
    input.addEventListener("keydown", e => {
      if (e.key === "ArrowDown") { this.move(1); e.preventDefault(); }
      else if (e.key === "ArrowUp") { this.move(-1); e.preventDefault(); }
      else if (e.key === "Enter" && this.results.length) this.pick(this.results[Math.max(this.active, 0)]);
      else if (e.key === "Escape") this.hide();
    });
    document.addEventListener("click", e => { if (!e.target.closest(".search")) this.hide(); });
  },

  async query(q) {
    try {
      const url = `${NOMINATIM}/search?format=json&limit=5&addressdetails=1&accept-language=${LANG}&q=${encodeURIComponent(q)}`;
      this.results = await fetch(url).then(r => r.json());
    } catch {
      this.results = [];
    }
    this.active = -1;
    this.render();
  },

  render() {
    const ul = el("searchResults");
    ul.innerHTML = "";
    if (!this.results.length) {
      const li = document.createElement("li");
      li.textContent = t("noResults");
      li.style.cursor = "default";
      ul.appendChild(li);
    }
    this.results.forEach((r, i) => {
      const li = document.createElement("li");
      const parts = r.display_name.split(", ");
      li.innerHTML = '<div class="r-main"></div><div class="r-sub"></div>';
      li.querySelector(".r-main").textContent = parts[0];
      li.querySelector(".r-sub").textContent = parts.slice(1).join(", ");
      li.classList.toggle("active", i === this.active);
      li.addEventListener("click", () => this.pick(r));
      ul.appendChild(li);
    });
    ul.hidden = false;
  },

  move(step) {
    if (!this.results.length) return;
    this.active = (this.active + step + this.results.length) % this.results.length;
    this.render();
  },

  pick(r) {
    const a = r.address || {};
    const local = a.village || a.town || a.city || a.municipality || a.county || r.display_name.split(", ")[0];
    const name = [local, a.country].filter(Boolean).join(", ");
    el("searchInput").value = r.display_name.split(", ")[0];
    this.hide();
    pickField(Number(r.lat), Number(r.lon), name);
  },

  hide() {
    el("searchResults").hidden = true;
  }
};
