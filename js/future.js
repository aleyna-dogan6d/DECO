// AI disclosure: written with AI assistance (Anthropic Claude, via Claude Code); reviewed and edited by the DECO team.
// Aşama 4: "Gelecek iklim" kaydırıcıları.
// Yeni bir bitki modeli DEĞİLDİR: Aşama 3'ün puanlama kuralları, kaydırılmış iklimle yeniden çalıştırılır.
// Bir tahmin değil; iklim değişirse kurallarımıza göre ne olacağını gösteren bir karşılaştırmadır.
//
// Kaydırma (ekip kararları, 14 Kasım 2026):
//  - Sıcaklık: 12 ayın ortalamasına ve her yılın aylık en düşük sıcaklığına aynı derece eklenir;
//    don ayları yeniden hesaplanır (en düşük sıcaklıkların da aynı miktarda ısındığı varsayılır).
//  - Yağış: 12 ayın yağışı aynı yüzdeyle değiştirilir.
//  - Isınmanın suya etkisi: FAO-56 Hargreaves denklemi (denklem 52). Referans buharlaşma (ET0) her ay için
//    hesaplanır; YILLIK toplamın bugüne göre oranı bulunur ve yağış bu orana bölünür ("etkili yağış").
//    Yalnızca sıcaklık kaydırıcısı sıfırdan farklıyken devreye girer; bugünün puanları değişmez.

const Future = {
  dT: 0,  // sıcaklık artışı, °C (0, 1, 2, 3)
  dP: 0,  // yağış değişimi, % (−30 … +10)
  DAYS: [31, 28.25, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

  active() {
    return this.dT !== 0 || this.dP !== 0;
  },

  // Hargreaves (FAO-56, denklem 52): ET0 = 0,0023 (Tort + 17,8) (Tmax − Tmin)^0,5 Ra   [mm/gün]
  // Tmax − Tmin yerine NASA POWER T2M_RANGE (günlük farkların aylık ortalaması), Ra yerine TOA_SW_DWN
  // (MJ/m²/gün; 0,408 ile mm/gün'e çevrilir) kullanılır. Ortalaması −17,8°C'nin altındaki ayda ET0 = 0 sayılır.
  // Yıllık toplamı mm olarak verir; veri eksikse null.
  et0Year(d, dT) {
    if (!d.monthRange || !d.monthRa || d.monthRange.some(v => v === null) || d.monthRa.some(v => v === null)) return null;
    return d.monthTemp.reduce((sum, T, i) => {
      const base = T + dT + 17.8;
      const perDay = base > 0 ? 0.0023 * base * Math.sqrt(Math.max(0, d.monthRange[i])) * d.monthRa[i] * 0.408 : 0;
      return sum + perDay * this.DAYS[i];
    }, 0);
  },

  // Gelecekteki yıllık ET0'ın bugünküne oranı (≥ 1). Hesaplanamıyorsa 1 (düzeltme yapılmaz).
  et0Ratio(d, dT) {
    if (!dT) return 1;
    const now = this.et0Year(d, 0), then = this.et0Year(d, dT);
    return now && then && now > 0 ? then / now : 1;
  },

  // Bugünün hesap bağlamından (ctx) kaydırılmış bir bağlam üretir; ctx'e dokunmaz.
  context(ctx) {
    const d = ctx.d, dT = this.dT;
    const ratio = this.et0Ratio(d, dT);
    const scale = (1 + this.dP / 100) / ratio; // yağış yüzdesi ve buharlaşma düzeltmesi birlikte
    const shifted = {
      ...d,
      monthTemp: d.monthTemp.map(v => v + dT),
      monthTmin: d.monthTmin.map(v => v + dT),
      temp: d.temp.map(v => v + dT),
      tminYears: d.tminYears.map(a => a.map(v => v + dT)),
      monthRain: d.monthRain.map(v => v * scale),
      rain: d.rain.map(v => v * scale)
    };
    shifted.frostMonths = coldRiskMonths(shifted, 0);
    return { ...ctx, d: shifted, rain: ctx.rain * scale, et0Ratio: ratio };
  },

  init() {
    const onChange = () => {
      this.dT = Number(el("futureTemp").value);
      this.dP = Number(el("futureRain").value);
      Cards.draw();
    };
    el("futureTemp").addEventListener("input", onChange);
    el("futureRain").addEventListener("input", onChange);
    el("futureReset").addEventListener("click", () => { this.reset(); Cards.draw(); });
    el("futureStickyBtn").addEventListener("click", () => el("futureBox").scrollIntoView({ behavior: "smooth", block: "start" }));

    // Mobilde kaydırıcı kutusu ekrandan çıkınca tek satırlık özet üstte sabit kalır
    // Masaüstünde plan gövdesi kendi içinde kayar; telefonda sayfanın kendisi kayar (plan haritanın altında, akışta)
    el("planBody").addEventListener("scroll", () => this.renderSticky(), { passive: true });
    window.addEventListener("scroll", () => this.renderSticky(), { passive: true });
  },

  // Kutu yukarıda kaldıysa (kullanıcı kartlara indiyse) true; kutuya henüz gelinmediyse ya da kutu gizliyse false
  boxPassed() {
    const box = el("futureBox").getBoundingClientRect();
    // Üst sınır: masaüstünde plan gövdesinin üstü; telefonda ekranın tepesi (sayfa kaydığı için)
    const top = isMobile() ? 0 : el("planBody").getBoundingClientRect().top;
    return box.height > 0 && box.bottom <= top + 1;
  },

  reset() {
    this.dT = 0;
    this.dP = 0;
    el("futureTemp").value = 0;
    el("futureRain").value = 0;
  },

  renderSticky() {
    const T = I18N[LANG].s3;
    const hide = el("planOptions").hidden || !this.boxPassed();
    if (el("futureSticky").hidden !== hide) el("futureSticky").hidden = hide;
    const text = T.futureSticky(T.tempShort(this.dT), T.rainShort(this.dP));
    if (el("futureStickyBtn").textContent !== text) el("futureStickyBtn").textContent = text;
  }
};
