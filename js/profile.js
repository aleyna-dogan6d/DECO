// AI disclosure: written with AI assistance (Anthropic Claude, via Claude Code); reviewed and edited by the DECO team.
// Tarla profili — PROTOTİP (sayfa: #profile).
// Hesap, şifre, e-posta YOK. Veriler yalnızca bu tarayıcıda saklanır (localStorage "deco-profile"); hiçbir sunucuya
// gönderilmez. "Bu yıl için önerimiz" yeni bir hesap değildir: plan ekranındaki kural tabanlı karşılaştırma,
// kayıtlı tarla ve rotasyonla yeniden çalıştırılır ve en yüksek puanlı kart gösterilir.

const PROFILE_KEY = "deco-profile";
const PROFILE_MOISTURE = ["dry", "normal", "wet"]; // "toprak elinize nasıl geliyor?"
const PROFILE_MAX_NOTES = 200;

// Örnek profil ("Örnek profili aç / Try a demo profile"): jüri ve denemek isteyenler şifresiz, tek tıkla görsün diye.
// Tarla ve yanıtlar ana sayfadaki Konya örneğiyle aynıdır (js/pages.js, HOME_EXAMPLE): kuru tarım, buğday (Eki–Tem) → nadas.
// Notlar ÖRNEKTİR, gerçek bir çiftçiye ait değildir; sayfada "Örnek" diye işaretlenir. Metinleri i18n.js'te (profile.demoNotes).
const PROFILE_DEMO = {
  field: { lat: 37.87, lng: 32.49, name: "Konya" },
  answers: {
    rotation: [{ crop: "wheat", sow: 10, harvest: 7 }, { crop: "fallow", sow: null, harvest: null }],
    sell: ["wheat", "lentil"], soil: "loam", water: "rainfed", slope: "gentle", prio: { water: 4, soil: 5, income: 2 }
  }
};
// Örnek notlar: [kaç gün önce, toprak nemi hissi]; metinler dile göre gösterilir
const PROFILE_DEMO_NOTES = [[6, "normal"], [34, "dry"], [62, "dry"]];

// "Kayıtlı tarla" kartındaki uydu görüntüsünün günü: SABİT bir tarih (her yer için aynı). Konya'da o gün büyük ölçüde
// bulutsuzdu (15 Kasım 2026'da görüntüye bakıldı); başka yerlerde bulutlu olabilir, kartta bu açıkça yazılır.
const PROFILE_SAT_DATE = "2026-07-20";

// İstatistik kutularındaki simgeler (elle çizilmiş SVG; hazır simge kütüphanesi kullanılmaz)
const PROFILE_ICONS = {
  bars: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 21h20M5 21V11M11 21V4M17 21v-7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22c5-3 8-7 8-12a8 8 0 0 0-16 0c0 5 3 9 8 12z" fill="currentColor"/></svg>',
  note: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v14H4zM4 10h16M8 3v5M16 3v5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

const Profile = {
  data: null,           // { v, name, field: { lat, lng, name }, answers, created, notes: [{ id, date, moisture, text }] }
  stored: true,         // tarayıcı kayda izin verdi mi (özel sekmede vermeyebilir)
  advice: null,         // "Bu yıl için önerimiz": { state: "loading" | "error" | "ready", ctx, result }
  confirmDelete: false, // "Profili sil"e bir kez basıldı; onay bekleniyor
  noteError: false,
  token: 0,             // eski iklim isteklerinin sonucunu yok saymak için

  init() {
    const body = el("profileBody");
    // Tarayıcı eski bir index.html'i önbellekten açmışsa profil bölümü sayfada olmayabilir; site yine de çalışsın
    if (!body) return;
    this.data = this.load();
    body.addEventListener("click", e => this.onClick(e));
    body.addEventListener("submit", e => { e.preventDefault(); this.onSubmit(e.target); });
  },

  // ---------- Saklama (yalnızca localStorage; hata olursa site çalışmaya devam eder) ----------
  load() {
    try {
      const s = JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
      if (!s || !s.field || !Number.isFinite(s.field.lat) || !Number.isFinite(s.field.lng)) return null;
      const answers = Plan.clean(s.answers);
      answers.rotation = answers.rotation.filter(p => Rotation.isComplete(p));
      if (!Rotation.timeline(answers.rotation)) return null;
      const isDate = v => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
      const note = n => {
        const out = { id: String(n.id), date: n.date, moisture: n.moisture, text: typeof n.text === "string" ? n.text.slice(0, 500) : "" };
        if (Number.isInteger(n.sample) && n.sample >= 0 && n.sample < PROFILE_DEMO_NOTES.length) out.sample = n.sample; // örnek profilin hazır notu
        return out;
      };
      return {
        v: 1,
        demo: s.demo === true, // "Örnek profili aç" ile yüklenen hazır profil
        name: typeof s.name === "string" ? s.name.slice(0, 40) : "",
        field: { lat: s.field.lat, lng: s.field.lng, name: typeof s.field.name === "string" ? s.field.name.slice(0, 120) : "" },
        answers,
        created: isDate(s.created) ? s.created : "",
        notes: (Array.isArray(s.notes) ? s.notes : [])
          .filter(n => n && isDate(n.date) && PROFILE_MOISTURE.includes(n.moisture))
          .slice(0, PROFILE_MAX_NOTES)
          .map(note)
      };
    } catch {
      return null;
    }
  },

  save() {
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(this.data)); this.stored = true; }
    catch { this.stored = false; } // kayıt yapılamazsa profil yalnızca bu sayfa açıkken durur; sayfada açıkça yazılır
  },

  // Bugünden "daysAgo" gün önceki tarih, YYYY-AA-GG
  today(daysAgo = 0) {
    const d = new Date(), two = n => String(n).padStart(2, "0");
    d.setDate(d.getDate() - daysAgo);
    return `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}`;
  },

  // "9 Kasım 2026"; short verilirse ay üç harfle ("9 Kas 2026"; dar istatistik kutusu için)
  dateText(iso, short = false) {
    const [y, m, d] = iso.split("-").map(Number), month = t("months")[m - 1];
    return `${d} ${short ? month.slice(0, 3) : month} ${y}`;
  },

  // Profil oluşturmak için plan ekranında gerekenler: seçili tarla + tamamlanmış rotasyon + toprak/su/eğim yanıtları
  source() {
    const a = Plan.answers;
    const field = typeof Field.lat === "number" && typeof Field.lng === "number" ? { lat: Field.lat, lng: Field.lng, name: Field.name || "" } : null;
    const rows = a.rotation.filter(p => Rotation.isComplete(p));
    const rotation = !Plan.rotationProblem() && Rotation.timeline(rows) ? rows : null;
    const answered = Object.keys(PLAN_QUESTIONS).every(q => a[q]);
    return { field, rotation, answered, ready: Boolean(field && rotation && answered) };
  },

  create(name) {
    const s = this.source();
    if (!s.ready) return;
    const a = Plan.answers;
    this.data = {
      v: 1,
      name: name.trim().slice(0, 40),
      field: { lat: Number(s.field.lat.toFixed(4)), lng: Number(s.field.lng.toFixed(4)), name: s.field.name },
      // Yanıtların kopyası saklanır: plan ekranında sonradan yapılan değişiklikler profili değiştirmez
      answers: JSON.parse(JSON.stringify({ rotation: s.rotation, sell: a.sell, soil: a.soil, water: a.water, slope: a.slope, prio: a.prio })),
      created: this.today(),
      notes: []
    };
    this.save();
    this.advice = null;
    this.render();
    this.loadAdvice();
  },

  // Hazır örnek profili yükler (yalnızca profil yokken düğmesi görünür; kimsenin profilinin üstüne yazmaz).
  // Normal bir profil gibi yalnızca bu tarayıcıda saklanır ve "Profili sil" ile silinir.
  loadDemo() {
    if (this.data) return;
    this.data = {
      v: 1,
      demo: true,
      name: "",
      field: { ...PROFILE_DEMO.field },
      answers: JSON.parse(JSON.stringify(PROFILE_DEMO.answers)),
      created: this.today(),
      notes: PROFILE_DEMO_NOTES.map(([days, moisture], i) => ({ id: `demo-${i}`, date: this.today(days), moisture, text: "", sample: i }))
    };
    this.save();
    this.advice = null;
    this.render();
    this.loadAdvice();
  },

  remove() {
    this.token++;
    this.data = null;
    this.advice = null;
    this.confirmDelete = false;
    try { localStorage.removeItem(PROFILE_KEY); } catch {}
    this.render();
  },

  addNote(date, moisture, text) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; // yalnızca listeden silerken notu bulmak için
    this.data.notes.unshift({ id, date, moisture, text: text.trim().slice(0, 500) });
    this.data.notes.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)); // en yeni tarih üstte
    this.data.notes = this.data.notes.slice(0, PROFILE_MAX_NOTES);
    this.save();
  },

  // ---------- Sayfa ----------
  // Profil sayfası açılınca (js/pages.js, Router) ve dil değişince çağrılır
  show() {
    this.confirmDelete = false;
    this.render();
    if (this.data && (!this.advice || this.advice.state === "error")) this.loadAdvice();
  },

  add(parent, tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    parent.appendChild(n);
    return n;
  },

  // Tarla, rotasyon ve yanıtların kısa listesi (profil oluşturma ve kayıtlı profil için aynı)
  factList(parent, field, answers) {
    const P = t("profile"), short = t("summaryLabels"), opts = t("opts");
    const rows = [
      [P.field, `${field.name || t("selectedPoint")} (${fmt(field.lat, 3)}°, ${fmt(field.lng, 3)}°)`],
      [short.rotation, answers.rotation.map(p => Plan.periodText(p)).join(" → ")]
    ];
    Object.keys(PLAN_QUESTIONS).forEach(q => rows.push([short[q], opts[q][answers[q]][0]]));
    const dl = this.add(parent, "dl", "profile-facts");
    rows.forEach(([k, v]) => { this.add(dl, "dt", "", k); this.add(dl, "dd", "", v); });
    return dl;
  },

  render() {
    const box = el("profileBody");
    if (!box) return;
    const P = t("profile");
    box.innerHTML = "";
    box.classList.toggle("dash", Boolean(this.data)); // kayıtlı profil varken gösterge paneli düzeni (daha geniş, iki sütun)
    if (!this.data) return this.renderCreate(box, P);

    const p = this.data;
    if (!this.stored) this.add(box, "p", "profile-alert", P.noStore);

    // Örnek profilde verilerin örnek olduğu en üstte açıkça yazılır
    if (p.demo) this.add(box, "p", "profile-demo-note", P.demoNotice).id = "profileDemoNote";

    // ---- Gösterge paneli ("Field dashboard") ----
    // Görünüm olarak AdminLTE v3 panosu örnek alındı (üstte istatistik kutuları, başlıklı kartlar, iki sütun);
    // Bootstrap, jQuery ya da AdminLTE dosyası EKLENMEDİ: yalnızca sitenin kendi CSS'i (css/style.css, .dash-*).
    this.add(box, "div", "dash-stats").id = "profileStats"; // içerik: renderStats()
    const grid = this.add(box, "div", "dash-grid");
    const left = this.add(grid, "div", "dash-col"), right = this.add(grid, "div", "dash-col");

    // Kart: kayıtlı tarla ve rotasyon
    const fieldBody = this.card(left, "dash-field", p.demo ? P.demoTitle : p.name ? P.savedTitleName(p.name) : P.savedTitle);
    this.factList(fieldBody, p.field, p.answers);
    if (p.created) this.add(fieldBody, "p", "profile-fine", P.created(this.dateText(p.created)));
    // Kayıtlı noktanın çevresinin uydu görüntüsü (NASA GIBS WMS, sabit tarih); ortadaki işaret kayıtlı noktadır
    const fig = this.add(fieldBody, "figure", "profile-sat"), pic = this.add(fig, "div", "profile-sat-img"), img = new Image();
    img.id = "profileSatImage";
    img.alt = P.satAlt;
    img.width = 640; img.height = 360; img.decoding = "async";
    pic.appendChild(img);
    this.add(pic, "span", "profile-sat-pin").setAttribute("aria-hidden", "true");
    loadGibsImage(img, gibsImageUrl(this.satBox(p.field), PROFILE_SAT_DATE));
    this.add(fig, "figcaption", "", P.satCaption(this.dateText(PROFILE_SAT_DATE)));

    // Kart: bu yıl için önerimiz
    this.card(right, "dash-advice", P.adviceTitle).id = "profileAdvice";
    this.renderAdvice();

    // Kart: aylık tarla notu (form + zaman çizelgesi görünümünde not listesi)
    const noteBody = this.card(left, "dash-notes", P.noteTitle);
    this.add(noteBody, "p", "", P.noteLead);
    const form = this.add(noteBody, "form", "profile-form");
    form.id = "profileNoteForm";
    form.noValidate = true;
    const dateLabel = this.add(form, "label", "profile-label", P.noteDate);
    const date = this.add(dateLabel, "input", "profile-input");
    date.type = "date"; date.name = "date"; date.value = this.today(); date.max = this.today();
    const set = this.add(form, "fieldset", "profile-set");
    this.add(set, "legend", "profile-label", P.noteMoisture);
    PROFILE_MOISTURE.forEach(m => {
      const lab = this.add(set, "label", "profile-choice");
      const r = document.createElement("input");
      r.type = "radio"; r.name = "moisture"; r.value = m;
      lab.append(r, ` ${P.moisture[m]}`);
    });
    const textLabel = this.add(form, "label", "profile-label", P.noteText);
    const ta = this.add(textLabel, "textarea", "profile-input");
    ta.name = "text"; ta.rows = 3; ta.maxLength = 500; ta.placeholder = P.notePlaceholder;
    const err = this.add(form, "p", "profile-error", P.noteError);
    err.id = "profileNoteError";
    err.hidden = !this.noteError;
    const save = this.add(form, "button", "btn btn-primary", P.noteSave);
    save.type = "submit";

    const listBox = this.add(noteBody, "div", "");
    listBox.id = "profileNotes";
    this.renderNotes();

    // Kart: profili sil (iki adımlı: önce sor, sonra sil)
    const del = this.card(right, "dash-delete", P.deleteTitle);
    del.classList.add("profile-delete");
    del.id = "profileDelete";
    this.renderDelete();
    this.renderStats();
  },

  // Uydu görüntüsünün alanı: kayıtlı noktanın kuzeyine ve güneyine 0,3° (yaklaşık 33 km); doğu–batı yönü yerde aynı
  // ölçekte olsun diye enleme göre genişletilir (16:9 kutu: yaklaşık 118 km × 66 km). Kenarlar 0,01°'ye yuvarlanır.
  // Dönen değer: [güney, batı, kuzey, doğu]
  satBox(f) {
    const h = 0.3, w = (h * 16 / 9) / Math.max(0.2, Math.cos((f.lat * Math.PI) / 180));
    const r = v => Math.round(v * 100) / 100;
    return [r(Math.max(-90, f.lat - h)), r(f.lng - w), r(Math.min(90, f.lat + h)), r(f.lng + w)];
  },

  // Başlıklı kart: gövdesini döndürür
  card(parent, cls, title) {
    const c = this.add(parent, "section", `dash-card ${cls}`);
    this.add(c, "h2", "dash-card-title", title);
    return this.add(c, "div", "dash-card-body");
  },

  // Kayıtlı tarla için en yüksek puanlı kart: kartta görünen (bir ondalığa yuvarlanmış) puana göre; eşitlikte çiftçinin kendi rotasyonu
  pick(a) {
    const tenth = v => Math.round(v * 10);
    const cur = { ev: a.result.current, option: null, plain: true };
    let best = cur;
    a.result.options.forEach(o => { if (tenth(o.ev.total) > tenth(best.ev.total)) best = { ev: o.ev, option: o, plain: true }; });
    return { cur, best };
  },

  // Üstteki dört istatistik kutusu: mevcut rotasyonun puanı, önerilen rotasyonun puanı, not sayısı, son not.
  // Puanlar "Bu yıl için önerimiz" kartındaki kural tabanlı karşılaştırmanın aynısıdır (yeni bir hesap değil).
  renderStats() {
    const box = el("profileStats");
    if (!box || !this.data) return;
    const P = t("profile"), a = this.advice, notes = this.data.notes, last = notes[0];
    let cur = "…", best = "…", curName = "", bestName = "";
    if (a && a.state === "ready") {
      const pk = this.pick(a);
      cur = `${fmt(pk.cur.ev.total, 1)} / 5`;
      best = `${fmt(pk.best.ev.total, 1)} / 5`;
      curName = Cards.title(pk.cur.ev.tl);
      bestName = pk.best === pk.cur ? P.statSame : Cards.title(pk.best.ev.tl);
    } else if (a && a.state === "error") {
      cur = best = "–";
    }
    const items = [
      ["st-green", cur, P.statCurrent, curName, PROFILE_ICONS.bars],
      ["st-bordo", best, P.statBest, bestName, PROFILE_ICONS.leaf],
      ["st-yellow", String(notes.length), P.statNotes, "", PROFILE_ICONS.note],
      ["st-dark st-date", last ? this.dateText(last.date, true) : "–", P.statLast, last ? P.moisture[last.moisture] : "", PROFILE_ICONS.calendar]
    ];
    box.innerHTML = "";
    items.forEach(([cls, value, label, sub, icon]) => {
      const s = this.add(box, "div", `dash-stat ${cls}`);
      s.innerHTML = icon; // sabit SVG (elle çizilmiş simge)
      this.add(s, "b", "", value);
      this.add(s, "span", "st-label", label);
      this.add(s, "span", "st-sub", sub);
    });
  },

  // Profil yokken: neye yaradığı + (plan ekranında tarla ve rotasyon varsa) oluşturma formu
  renderCreate(box, P) {
    this.add(box, "p", "lead", P.intro);
    // Örnek profil: tek tıkla hazır bir profil (jüri ve denemek isteyenler için; şifre ya da hesap yok)
    const demo = this.add(box, "div", "profile-demo");
    const demoBtn = this.add(demo, "button", "btn btn-primary", P.demoBtn);
    demoBtn.type = "button"; demoBtn.dataset.act = "demo";
    this.add(demo, "span", "profile-fine", P.demoHint);
    const s = this.source();
    if (!s.ready) {
      const empty = this.add(box, "div", "empty-box");
      empty.id = "profileNeed";
      this.add(empty, "p", "empty-title", P.needTitle);
      const ul = this.add(empty, "ul", "plain-list");
      this.add(ul, "li", "", `${P.field}: ${s.field ? `${s.field.name || t("selectedPoint")} ✓` : P.missing}`);
      this.add(ul, "li", "", `${t("summaryLabels").rotation}: ${s.rotation ? `${s.rotation.map(p => Plan.periodText(p)).join(" → ")} ✓` : P.missing}`);
      this.add(ul, "li", "", `${P.answers}: ${s.answered ? "✓" : P.missing}`);
      const go = this.add(empty, "a", "cta cta-small", P.goPlan);
      go.href = "#plan";
      return;
    }
    this.add(box, "h2", "mid", P.createTitle);
    this.add(box, "p", "", P.createLead);
    this.factList(box, s.field, Object.assign({}, Plan.answers, { rotation: s.rotation }));
    const form = this.add(box, "form", "profile-form");
    form.id = "profileCreateForm";
    const label = this.add(form, "label", "profile-label", P.nameLabel);
    const input = this.add(label, "input", "profile-input");
    input.type = "text"; input.name = "name"; input.maxLength = 40; input.autocomplete = "off"; input.placeholder = P.namePlaceholder;
    this.add(form, "p", "profile-fine", P.noAccount);
    const b = this.add(form, "button", "btn btn-primary", P.createBtn);
    b.type = "submit";
  },

  // "Bu yıl için önerimiz": kayıtlı tarlanın iklimi (NASA POWER) ve kayıtlı yanıtlarla mevcut motor çalıştırılır
  async loadAdvice() {
    if (!this.data) return;
    const my = ++this.token, p = this.data;
    this.advice = { state: "loading" };
    this.renderAdvice();
    try {
      const d = await Field.loadClimate(p.field.lat, p.field.lng);
      if (my !== this.token) return;
      const ctx = Cards.context(p.answers, d);
      const result = ctx ? Rotation.alternatives(p.answers.rotation, ctx) : null;
      this.advice = result && result.current ? { state: "ready", ctx, result } : { state: "error" };
    } catch (e) {
      if (my !== this.token) return;
      console.warn("Profil: iklim verisi yüklenemedi", e);
      this.advice = { state: "error" };
    }
    this.renderAdvice();
  },

  renderAdvice() {
    const box = el("profileAdvice");
    if (!box) return;
    const P = t("profile"), a = this.advice;
    box.innerHTML = "";
    this.renderStats(); // üstteki puan kutuları da aynı sonuçtan yazılır
    if (!a || a.state === "loading") { this.add(box, "p", "profile-status", t("loadingClimate")); return; }
    if (a.state === "error") {
      this.add(box, "p", "profile-status", t("climateError"));
      const retry = this.add(box, "button", "btn btn-soft", P.retry);
      retry.type = "button"; retry.dataset.act = "retry";
      return;
    }
    const { cur, best } = this.pick(a);
    const curScore = fmt(cur.ev.total, 1);
    this.add(box, "p", "profile-advice-line", best === cur
      ? (a.result.options.length ? P.adviceKeep(curScore) : P.adviceOnly(curScore))
      : P.adviceChange(fmt(best.ev.total, 1), curScore));
    const card = Cards.card(best, a.ctx, null, cur);
    card.querySelector(".opt-inspect").remove(); // inceleme paneli yalnızca plan ekranında
    this.add(box, "div", "profile-card").appendChild(card);
    this.add(box, "p", "profile-fine", P.adviceNote);
    const more = this.add(box, "p", "profile-fine");
    const link = this.add(more, "a", "", P.adviceMore);
    link.href = "#plan";
  },

  renderNotes() {
    const box = el("profileNotes");
    if (!box) return;
    const P = t("profile"), notes = this.data.notes;
    box.innerHTML = "";
    this.add(box, "h3", "profile-notes-title", P.notesTitle(notes.length));
    if (!notes.length) { this.add(box, "p", "profile-fine", P.notesEmpty); this.renderStats(); return; }
    const ul = this.add(box, "ul", "profile-notes");
    notes.forEach(n => {
      const li = this.add(ul, "li", "profile-note");
      const head = this.add(li, "p", "profile-note-head");
      this.add(head, "b", "", this.dateText(n.date));
      this.add(head, "span", `profile-moist profile-moist-${n.moisture}`, P.moisture[n.moisture]);
      const sample = Number.isInteger(n.sample); // örnek profilin hazır notu: metni dile göre gelir ve "Örnek" etiketi taşır
      if (sample) this.add(head, "span", "profile-sample", P.demoBadge);
      const del = this.add(head, "button", "profile-note-del", P.noteDelete);
      del.type = "button"; del.dataset.act = "note-del"; del.dataset.id = n.id;
      const text = sample ? P.demoNotes[n.sample] : n.text;
      if (text) this.add(li, "p", "profile-note-text", text);
    });
    this.renderStats(); // not sayısı ve son not kutuları
  },

  renderDelete() {
    const box = el("profileDelete");
    if (!box) return;
    const P = t("profile");
    box.innerHTML = "";
    if (!this.confirmDelete) {
      const b = this.add(box, "button", "btn profile-danger", P.deleteBtn);
      b.type = "button"; b.dataset.act = "delete-ask";
      return;
    }
    this.add(box, "p", "profile-alert", P.deleteConfirm);
    const yes = this.add(box, "button", "btn profile-danger", P.deleteYes);
    yes.type = "button"; yes.dataset.act = "delete-yes";
    const no = this.add(box, "button", "btn btn-soft", P.deleteNo);
    no.type = "button"; no.dataset.act = "delete-no";
  },

  // ---------- Olaylar ----------
  onClick(e) {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const act = b.dataset.act;
    if (act === "retry") this.loadAdvice();
    else if (act === "demo") this.loadDemo();
    else if (act === "delete-ask") { this.confirmDelete = true; this.renderDelete(); }
    else if (act === "delete-no") { this.confirmDelete = false; this.renderDelete(); }
    else if (act === "delete-yes") this.remove();
    else if (act === "note-del") {
      this.data.notes = this.data.notes.filter(n => n.id !== b.dataset.id);
      this.save();
      this.renderNotes();
    }
  },

  onSubmit(form) {
    if (form.id === "profileCreateForm") return this.create(form.elements.name.value);
    if (form.id !== "profileNoteForm" || !this.data) return;
    const date = form.elements.date.value, moisture = form.elements.moisture.value;
    // Tarih ve toprak nemi zorunlu; not isteğe bağlı. Gelecek tarih kabul edilmez.
    this.noteError = !/^\d{4}-\d{2}-\d{2}$/.test(date) || date > this.today() || !PROFILE_MOISTURE.includes(moisture);
    el("profileNoteError").hidden = !this.noteError;
    if (this.noteError) return;
    this.addNote(date, moisture, form.elements.text.value);
    form.reset();
    form.elements.date.value = this.today();
    this.renderNotes();
    if (!this.stored) this.render(); // kayıt yapılamadıysa uyarı görünsün
  }
};
