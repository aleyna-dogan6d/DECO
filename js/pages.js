// Sayfalar: Ana sayfa (#home), Tarlamı planla (#plan; uygulamanın kendisi), Çiftçiler (#farmers), Hakkımızda (#about).
// Hepsi tek HTML dosyasındadır; adresin "#" kısmına göre yalnızca biri görünür. Uygulama (harita ve plan) değişmedi.

const ROUTES = ["home", "plan", "farmers", "about", "profile"]; // "profile": tarla profili prototipi (js/profile.js)

// "Tarladan" sayfasındaki yorum formunun (Google Form) adresi. Ekip verince TIRNAKLARIN ARASINA yazılır
// (https:// ile başlamalı). Boşken sayfada çalışmayan bir "Yakında" düğmesi ve "Yorum formu yakında açılacak"
// açıklaması görünür; dolunca düğme "Yorum yaz →" olur ve formu yeni sekmede açar.
const COMMENT_FORM_URL = "";

// Ana sayfadaki örnek: Konya, kuru tarım, buğday (Eki–Tem) → nadas; su 4, toprak 5, gelir 2; kolay satılan: buğday, mercimek.
// Puanlar bu yanıtlarla uygulamanın verdiği gerçek puanlardır (14 Kasım 2026). Kurallar ya da ağırlıklar değişirse
// burası da güncellenmeli; test betiği (a4 kipi) bu sayıları motorun sonucuyla karşılaştırır.
// parts: [ürün kısa adı | "fallow" (nadas) | "bare" (ürünsüz), ay sayısı]
const HOME_EXAMPLE = [
  { label: "exYour", note: "exYourNote", score: 3.0, parts: [["wheat", 10], ["fallow", 12], ["bare", 2]] },
  { label: "exSoil", note: "exSoilNote", score: 3.8, parts: [["wheat", 10], ["bare", 3], ["lentil", 8], ["bare", 3]] },
  { label: "exWater", note: "exWaterNote", score: 2.5, parts: [["barley", 8], ["fallow", 12], ["bare", 4]] }
];

// Ana sayfa hikâyesindeki uydu kareleri: üç katmanın da verisi olan ay; karolar z=3, x 3–6, y 2–3
// (Avrupa – Orta Doğu – Güney Asya – Kuzey Afrika). Katman kimlikleri js/layers.js'ten gelir.
const STORY_YEAR = 2026, STORY_MONTH = 6;
const STORY_TIME = `${STORY_YEAR}-${String(STORY_MONTH).padStart(2, "0")}-01`;
const STORY_TILES = { z: 3, x: [3, 6], y: [2, 3] };
const STORY_NEEDS_LINES = ["temp", "rain"];
const STORY_INSTRUMENT = { ndvi: "MODIS/Terra", soil: "GLDAS", rain: "MERRA-2", temp: "MERRA-2" }; // GIBS katman kimliklerindeki adlar

// Hakkımızda sayfasındaki kaynak listesi: yalnızca sitenin gerçekten kullandığı kaynaklar (README.md ile aynı tutulmalı)
const SOURCES = [
  { name: "NASA GIBS (Global Imagery Browse Services)", url: "https://earthdata.nasa.gov/gibs",
    use: { en: "All map layers and the base map.", tr: "Bütün harita katmanları ve altlık harita." } },
  { name: "NASA POWER", url: "https://power.larc.nasa.gov/",
    use: { en: "Monthly climate for the selected point, 2001–2024.", tr: "Seçilen noktanın aylık iklimi, 2001–2024." } },
  { name: "FAO ECOCROP (via the Recocrop package)", url: "https://ecocrop.apps.fao.org",
    use: { en: "Temperature and rain ranges of the crops.", tr: "Ürünlerin sıcaklık ve yağış aralıkları." } },
  { name: "FAO Irrigation Water Management Training Manual No. 3", url: "https://www.fao.org/4/s2022e/s2022e07.htm",
    use: { en: "Crop water needs and typical growing-period lengths.", tr: "Ürünlerin su ihtiyacı ve tipik yetişme süreleri." } },
  { name: "FAO Irrigation Water Management Training Manual No. 1", url: "https://www.fao.org/4/r4082e/r4082e03.htm",
    use: { en: "The sentences about sandy and clay soil.", tr: "Kumlu ve killi toprakla ilgili cümleler." } },
  { name: "FAO-56 (crop evapotranspiration)", url: "https://www.fao.org/4/x0490e/x0490e07.htm",
    use: { en: "The Hargreaves equation used by the climate sliders.", tr: "İklim kaydırıcılarında kullanılan Hargreaves denklemi." } },
  { name: "FAO Conservation Agriculture", url: "https://www.fao.org/conservation-agriculture/en/",
    use: { en: "The principles of keeping the soil covered and growing at least three crops.", tr: "Toprağı örtülü tutma ve en az üç ürün yetiştirme ilkeleri." } },
  { name: "FAO Crop Calendar", url: "https://cropcalendar.apps.fao.org/",
    use: { en: "Used only to check crop durations; only potato and sweet potato in Jamaica could be checked.", tr: "Yalnızca ürün sürelerinin kontrolünde kullanıldı; yalnızca Jamaika'da patates ve tatlı patates doğrulanabildi." } },
  { name: "OpenStreetMap / Nominatim", url: "https://www.openstreetmap.org/copyright",
    use: { en: "Map data behind the base map; place search.", tr: "Altlık haritanın verisi; yer arama." } },
  { name: "Leaflet 1.9.4", url: "https://leafletjs.com/",
    use: { en: "The interactive map (BSD-2-Clause licence).", tr: "Etkileşimli harita (BSD-2-Clause lisansı)." } },
  { name: "Chart.js 4.4.1", url: "https://www.chartjs.org",
    use: { en: "The rain and temperature chart (MIT licence).", tr: "Yağış ve sıcaklık grafiği (MIT lisansı)." } },
  { name: "GSAP 3.15.1", url: "https://gsap.com/standard-license",
    use: { en: "Scroll animations on the Home, From the Field and About pages; loaded from a CDN under GSAP's own \"no charge\" licence (not open source).",
      tr: "Ana sayfa, Tarladan ve Hakkımızda sayfalarındaki kaydırma animasyonları; CDN'den yüklenir, GSAP'in kendi \"ücretsiz\" lisansıyla (açık kaynak değil)." } }
];

const Router = {
  current: null,

  init() {
    window.addEventListener("hashchange", () => this.go());
    this.go();
  },

  route() {
    const r = location.hash.slice(1);
    return ROUTES.includes(r) ? r : "home";
  },

  go() {
    const r = this.route();
    if (r === this.current) return;
    const prev = this.current;
    this.current = r;
    document.documentElement.dataset.route = r;
    el("pagePlan").hidden = r !== "plan";
    el("pageHome").hidden = r !== "home";
    el("pageFarmers").hidden = r !== "farmers";
    el("pageAbout").hidden = r !== "about";
    // (Profil bölümü ve bağlantısı için "varsa" denetimi: tarayıcı eski bir index.html'i önbellekten açmışsa site bozulmasın)
    if (el("pageProfile")) el("pageProfile").hidden = r !== "profile";
    document.querySelectorAll("#tabs .tab").forEach(a => {
      if (a.dataset.route === r) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    if (el("profileLink")) { if (r === "profile") el("profileLink").setAttribute("aria-current", "page"); else el("profileLink").removeAttribute("aria-current"); }
    if (r === "profile") Profile.show(); // kayıtlı profil ya da oluşturma formu; öneri kartı için iklim verisi istenir
    if (r === "plan") {
      // Harita ilk açılışta kurulur; sonraki dönüşlerde boyutu yeniden ölçtürülür (gizliyken boyutunu bilemez)
      startMap();
      MapView.map.invalidateSize();
      renderLayerList();
    } else {
      if (prev === "plan") setPlaying(false); // başka sayfaya geçince "Geçmişi oynat" durur
      window.scrollTo(0, 0);
    }
    Pages.onRoute(r, prev);
  }
};

const Pages = {
  formUrl: COMMENT_FORM_URL, // yorum formunun adresi (yukarıdaki sabitten; yalnızca https adresi kabul edilir)
  ctx: null,        // çalışan GSAP animasyonları (sayfa değişince geri alınır)
  mode: null,       // ana sayfa hikâyesinin düzeni: "pinned" (sahne yerinde durur) ya da "stacked" (alt alta)
  introDone: false,

  init() {
    this.buildTiles();
    this.render();
    Router.init();
  },

  // Dil değişince ya da ilk açılışta: koddan gelen metinler ve sayılar
  render() {
    const T = I18N[LANG].pg;
    document.title = `DECO — ${t("brandSub")}`;
    this.renderStory();

    // Sayı satırı: katman sayısı, iklim kaydının yıl sayısı ve ürün sayısı koddan gelir
    el("numLayers").textContent = LAYERS.length;
    el("numYears").textContent = YEARS[1] - YEARS[0] + 1;
    el("numCrops").textContent = CROPS.length;
    el("numZero").textContent = 0;

    // Örnek rotasyon şeritleri
    const box = el("homeStrips");
    box.innerHTML = "";
    const head = document.createElement("p");
    head.className = "ex-head";
    head.textContent = T.exHead;
    box.appendChild(head);
    HOME_EXAMPLE.forEach(row => {
      const label = document.createElement("p");
      label.className = "ex-label";
      label.textContent = T[row.label];
      const bar = document.createElement("div");
      bar.className = "ex-bar";
      let n = 0;
      row.parts.forEach(([id, months]) => {
        const part = document.createElement("span");
        part.style.flexGrow = months;
        if (id === "bare") part.className = "ex-bare";
        else if (id === FALLOW) { part.className = "ex-fallow"; part.textContent = t("fallowShort"); }
        else { part.className = `ex-crop ex-crop${n++ % 2} ex-${id}`; part.textContent = cropName(id); }
        bar.appendChild(part);
      });
      const score = document.createElement("p");
      score.className = "ex-score";
      const note = document.createElement("span"), value = document.createElement("b");
      note.textContent = T[row.note];
      value.dataset.score = row.score;
      value.textContent = `${fmt(row.score, 1)} / 5`;
      score.append(note, value);
      box.append(label, bar, score);
    });

    // Yorum formu (ekip kararı, 15 Kasım 2026): adres varsa "Yorum yaz →" düğmesi forma gider (yeni sekmede);
    // adres yokken çalışmayan bir "Yakında" düğmesi ve açıklama görünür, hiçbir şey gönderilmez.
    const formUrl = /^https:\/\//.test(this.formUrl) ? this.formUrl : "";
    el("commentFormSoon").hidden = Boolean(formUrl);
    el("commentFormOff").hidden = Boolean(formUrl);
    el("planFormSoon").hidden = Boolean(formUrl); // plan ekranındaki bağlantının yanındaki "yakında" bilgisi
    el("commentFormLink").hidden = !formUrl;
    if (formUrl) el("commentFormLink").href = formUrl; else el("commentFormLink").removeAttribute("href");

    // Kaynaklar
    const list = el("aboutSources");
    list.innerHTML = "";
    SOURCES.forEach(s => {
      const li = document.createElement("li"), a = document.createElement("a");
      a.href = s.url; a.textContent = s.name; a.target = "_blank"; a.rel = "noopener";
      li.append(a, ` — ${s.use[LANG]}`);
      list.appendChild(li);
    });
  },

  refreshLanguage() {
    this.render();
    Profile.render(); // profil sayfasının metinleri koddan yazılır
    if (Router.current) this.animate(Router.current);
  },

  onRoute(route) {
    this.animate(route);
  },

  // ---------- Ana sayfa hikâyesi: karolar ----------
  // Her kare aynı 8 karoyu (aynı bölge, aynı ölçek) kendi katmanıyla gösterir; altta NASA GIBS kara/su altlığı.
  buildTiles() {
    const { z, x, y } = STORY_TILES;
    document.querySelectorAll("#homeStory .frame").forEach((frame, i) => {
      const layer = LAYERS.find(l => l.id === frame.dataset.layer);
      const data = GIBS_URL.replace("{layer}", layer.gibs).replace("{time}", STORY_TIME).replace("{tms}", layer.tms).replace("{ext}", layer.ext);
      const grid = url => {
        const box = document.createElement("div");
        box.className = "tiles";
        for (let ty = y[0]; ty <= y[1]; ty++) for (let tx = x[0]; tx <= x[1]; tx++) {
          const img = new Image();
          img.alt = "";
          img.decoding = "async";
          if (i > 0) img.loading = "lazy"; // alt alta düzende (mobil) karolar görünmeye yakınken yüklenir
          img.src = url.replace("{z}", z).replace("{y}", ty).replace("{x}", tx);
          box.appendChild(img);
        }
        return box;
      };
      const base = grid(BASEMAP.base);
      base.classList.add("tiles-base");
      const shade = document.createElement("div");
      shade.className = "frame-shade";
      // Bütün dünyayı kaplayan (denizleri de boyayan) katmanlarda kıyı ve sınır çizgileri üstte gösterilir
      const parts = [base, grid(data)];
      if (STORY_NEEDS_LINES.includes(layer.id)) parts.push(grid(BASEMAP.borders));
      frame.prepend(...parts, shade);
    });
  },

  // Karelerin katman adı ve kaynak etiketi (dile göre)
  renderStory() {
    document.querySelectorAll("#homeStory .frame").forEach(frame => {
      const id = frame.dataset.layer, layer = LAYERS.find(l => l.id === id);
      const kicker = frame.querySelector(".frame-kicker");
      if (kicker) kicker.textContent = layer.title[LANG];
      frame.querySelector(".frame-src").textContent =
        `${layer.title[LANG]}${id === "ndvi" ? " (NDVI)" : ""} · ${STORY_INSTRUMENT[id]} · ${t("months")[STORY_MONTH - 1]} ${STORY_YEAR} · NASA GIBS`;
    });
  },

  // ---------- Animasyonlar (GSAP; yalnızca içerik sayfalarında) ----------
  // Tarayıcıda "hareketi azalt" açıksa ya da GSAP yüklenemediyse hiçbir animasyon çalışmaz; her şey düz ve görünür kalır.
  motionOK() {
    return typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  },

  stopMotion() {
    if (!this.ctx) return;
    this.ctx.revert(); // GSAP'in koyduğu bütün stiller ve kaydırma tetikleyicileri geri alınır
    this.ctx = null;
    this.render();     // sayarken yarıda kalmış sayılar son hâline döner
  },

  animate(route) {
    this.stopMotion();
    const story = el("homeStory");
    // Sahne yalnızca masaüstünde ve hareket serbestken yerinde durur; mobilde kareler alt alta düz bölümlerdir
    const pinned = route === "home" && this.motionOK() && !isMobile();
    story.classList.toggle("pinned", pinned);
    story.classList.toggle("stacked", !pinned);
    this.mode = route === "home" ? (pinned ? "pinned" : "stacked") : null;
    if (route === "plan" || !this.motionOK()) return;

    gsap.registerPlugin(ScrollTrigger);
    const page = el({ home: "pageHome", farmers: "pageFarmers", about: "pageAbout", profile: "pageProfile" }[route]);
    this.ctx = gsap.context(() => {
      if (route === "home") this.animateHome(pinned);
      // Bölümlerin hafifçe yukarı kayarak belirmesi (React Bits "FadeContent" / "AnimatedContent"ten esinlenildi)
      page.querySelectorAll(".reveal").forEach(node =>
        gsap.from(node, { autoAlpha: 0, y: 32, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: node, start: "top 88%" } }));
    }, page);
  },

  animateHome(pinned) {
    const story = el("homeStory"), frames = gsap.utils.toArray("#homeStory .frame");

    // Başlık ilk açılışta kelime kelime belirir (React Bits "SplitText"ten esinlenildi)
    if (!this.introDone) {
      this.introDone = true;
      const h1 = el("homeTitle");
      h1.innerHTML = h1.textContent.split(" ").map(w => `<span class="w"><i>${w}</i></span>`).join(" ");
      gsap.from("#homeTitle .w i", { yPercent: 110, duration: 0.7, ease: "power3.out", stagger: 0.06, delay: 0.1 });
      gsap.from(".frame-hero .kicker, .frame-hero .hero-lead, .frame-hero .cta", { autoAlpha: 0, y: 14, duration: 0.6, delay: 0.5, stagger: 0.12 });
    }

    if (pinned) {
      // Sahne yerinde durur; kaydırdıkça: başlık → bitki örtüsü cümlesi → toprak nemi → üçüncü katman.
      // Geçiş kaydırmaya bağlıdır (geri kaydırınca geri gider).
      const dots = story.querySelectorAll(".story-dots i"), dotOf = [0, 0, 1, 2];
      gsap.set(frames.slice(1), { autoAlpha: 0 });
      const tl = gsap.timeline({
        // Alttaki üç çizgi, o an hangi katmanın göründüğünü gösterir
        onUpdate: () => {
          const i = Math.min(frames.length - 1, Math.floor(tl.time() + 0.05));
          dots.forEach((d, k) => d.classList.toggle("on", k === dotOf[i]));
        },
        scrollTrigger: {
          trigger: story, pin: true, scrub: 0.4, invalidateOnRefresh: true,
          start: () => `top ${document.querySelector(".topbar").offsetHeight}`,
          end: () => `+=${window.innerHeight * 3}`
        }
      });
      frames.forEach((frame, i) => {
        if (!i) return;
        tl.to(frames[i - 1].querySelector(".frame-copy"), { autoAlpha: 0, y: -30, duration: 0.4 }, i - 0.45)
          .to(frame, { autoAlpha: 1, duration: 0.5 }, i - 0.15)
          .from(frame.querySelector(".frame-copy"), { autoAlpha: 0, y: 30, duration: 0.4 }, i + 0.1);
      });
      tl.to({}, { duration: 0.7 });
    } else {
      frames.slice(1).forEach(frame =>
        gsap.from(frame.querySelector(".frame-copy"), { autoAlpha: 0, y: 24, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: frame, start: "top 78%" } }));
    }

    // Rotasyon şeritleri soldan uzar; puanlar ve sayılar sıfırdan sayar (React Bits "CountUp"tan esinlenildi)
    gsap.from("#homeStrips .ex-bar span", { scaleX: 0, duration: 0.6, ease: "power2.out", stagger: 0.06, scrollTrigger: { trigger: "#homeStrips", start: "top 82%" } });
    document.querySelectorAll("#homeStrips [data-score]").forEach(node => {
      const o = { v: 0 }, end = Number(node.dataset.score);
      gsap.to(o, { v: end, duration: 0.9, ease: "power1.out", scrollTrigger: { trigger: node, start: "top 92%" }, onUpdate: () => { node.textContent = `${fmt(o.v, 1)} / 5`; } });
    });
    gsap.from("#homeSteps > div", { autoAlpha: 0, y: 28, duration: 0.6, stagger: 0.1, scrollTrigger: { trigger: "#homeSteps", start: "top 86%" } });
    document.querySelectorAll("#homeNums b").forEach(node => {
      const o = { v: 0 }, end = Number(node.textContent);
      gsap.to(o, { v: end, duration: 0.9, ease: "power1.out", scrollTrigger: { trigger: node, start: "top 94%" }, onUpdate: () => { node.textContent = Math.round(o.v); } });
    });
  }
};

// Pencere masaüstü ↔ mobil genişliği arasında değişirse hikâyenin düzeni de değişir
window.addEventListener("resize", () => {
  clearTimeout(Pages._resize);
  Pages._resize = setTimeout(() => {
    if (Router.current !== "home") return;
    const want = Pages.motionOK() && !isMobile() ? "pinned" : "stacked";
    if (want !== Pages.mode) Pages.animate("home");
  }, 200);
});
