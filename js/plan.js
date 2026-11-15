// AI disclosure: written with AI assistance (Anthropic Claude, via Claude Code); reviewed and edited by the DECO team.
// Tarla planı ekranı: tarla takvimi + form.
// Yanıtlar yalnızca bu cihazda saklanır (localStorage); hiçbir sunucuya gönderilmez.

const PLAN_KEY = "fs-plan";
const MAX_PERIODS = 6; // mevcut rotasyonda en fazla 6 ekim dönemi

function cropName(id) {
  const crop = CROPS.find(c => c.id === id);
  return crop ? crop.name[LANG] : id;
}

// Tek seçimli sorular ve seçenekleri. Metinler i18n.js'te "opts" altında.
const PLAN_QUESTIONS = {
  soil: ["sandy", "loam", "clay", "unknown"],
  water: ["irrigated", "limited", "rainfed"],
  slope: ["flat", "gentle", "steep"]
};

// Öncelik kaydırıcıları (1–5). Ağırlığa nasıl çevrileceği Aşama 3 kararı; burada yalnızca saklanır.
const PLAN_PRIORITIES = ["water", "soil", "income"];

const Plan = {
  answers: null,
  submitted: false,

  blankPeriod() {
    return { crop: null, sow: null, harvest: null }; // sow / harvest: 1–12 (ay)
  },

  blank() {
    return {
      rotation: [this.blankPeriod()],
      sell: [], // kolay satılan ürünlerin kısa adları (Aşama 3)
      soil: null, water: null, slope: null,
      prio: { water: 3, soil: 3, income: 3 }
    };
  },

  // Kayıtlı yanıtları okur; bozuk ya da tanınmayan değerleri yok sayar
  load() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(PLAN_KEY) || "null"); } catch {}
    return this.clean(saved);
  },

  // Saklanmış yanıtları denetler; bozuk ya da tanınmayan değerleri yok sayar. (Tarla profili de kullanır.)
  clean(saved) {
    const a = this.blank();
    try {
      if (saved) {
        const ids = CROPS.map(c => c.id);
        const month = v => (Number.isInteger(v) && v >= 1 && v <= 12 ? v : null);
        if (Array.isArray(saved.rotation) && saved.rotation.length) {
          a.rotation = saved.rotation.slice(0, MAX_PERIODS).map(p => {
            if (p && p.crop === FALLOW) return { crop: FALLOW, sow: null, harvest: null };
            if (p && p.crop === OTHER) return { crop: OTHER, name: typeof p.name === "string" ? p.name.slice(0, 40) : "", sow: month(p.sow), harvest: month(p.harvest) };
            return { crop: p && ids.includes(p.crop) ? p.crop : null, sow: month(p && p.sow), harvest: month(p && p.harvest) };
          });
        }
        if (Array.isArray(saved.sell)) a.sell = ids.filter(id => saved.sell.includes(id));
        Object.keys(PLAN_QUESTIONS).forEach(q => {
          if (PLAN_QUESTIONS[q].includes(saved[q])) a[q] = saved[q];
        });
        PLAN_PRIORITIES.forEach(p => {
          const v = Math.round(Number(saved.prio && saved.prio[p]));
          if (v >= 1 && v <= 5) a.prio[p] = v;
        });
        // 5 dakikalık tarla testi: yalnızca kayıt (puana girmez); test hiç yapılmadıysa alan hiç yoktur
        const check = FieldCheck.clean(saved.check);
        if (check) a.check = check;
      }
    } catch {}
    return a;
  },

  save() {
    try { localStorage.setItem(PLAN_KEY, JSON.stringify(this.answers)); } catch {}
  },

  init() {
    this.answers = this.load();
    el("planAttrib").innerHTML = MAP_ATTRIBUTION; // mobilde plan haritayı örttüğü için atıf burada da durur
    el("planClose").addEventListener("click", () => this.close());
    el("planReset").addEventListener("click", () => this.reset());
    el("addPeriod").addEventListener("click", () => this.addPeriod());
    el("rotationRows").addEventListener("click", e => {
      const btn = e.target.closest("[data-rot='del']");
      if (btn) this.removePeriod(Number(btn.closest(".rot-row").dataset.index));
    });
    el("planForm").addEventListener("submit", e => { e.preventDefault(); this.submit(); });
    el("planForm").addEventListener("input", e => this.onInput(e.target));
    Future.init();
    FieldCheck.init();
    this.renderForm();
  },

  isOpen() {
    return !el("planPanel").hidden;
  },

  open() {
    if (!Field.data) return;
    this.hideResults();
    el("formError").hidden = true;
    this.renderHead();
    Calendar.render(Field.data);
    el("planPanel").hidden = false;
    this.renderRotationInfo();
    document.querySelector(".stage").classList.add("plan-open");
    el("planBody").scrollTop = 0;

    // Telefonda plan haritanın altında, sayfa akışında açılır: sayfa planın başına kaydırılır
    if (isMobile()) el("planPanel").scrollIntoView({ block: "start" });

    // Masaüstünde tarla işaretini, katman kartı ile plan paneli arasında kalan boşluğa getir
    if (!isMobile()) {
      const mapBox = el("map").getBoundingClientRect();
      const left = document.querySelector(".layers").getBoundingClientRect().right - mapBox.left;
      const right = el("planPanel").getBoundingClientRect().left - mapBox.left;
      MapView.focusPin((left + right) / 2);
    }
  },

  close() {
    if (!this.isOpen()) return;
    el("planPanel").hidden = true;
    document.querySelector(".stage").classList.remove("plan-open");
    if (!isMobile()) MapView.focusPin();
    else window.scrollTo(0, 0); // telefonda "Haritaya dön": sayfanın başına (haritaya) dönülür
  },

  renderHead() {
    el("planTitle").textContent = Field.name || t("selectedPoint");
    el("planCoords").textContent = `${fmt(Field.lat, 3)}°, ${fmt(Field.lng, 3)}°`;
  },

  // ---------- Mevcut rotasyon: ekim dönemleri ----------
  isComplete(p) { return Rotation.isComplete(p); }, // nadas satırı ay istemez
  isEmpty(p) { return !p.crop && !p.sow && !p.harvest; },

  // Dönemleri girildiği sırayla takvime dizer: her ekim, bir önceki hasattan sonraki ilk uygun aya düşer.
  // Rotasyonun kaç yılda bir tekrar ettiğini ve tarlanın kaç ay ürünsüz kaldığını verir.
  // Ekim ve hasat ayları ürünlü sayılır (Eki–Tem = 10 ay). Bir ürünün hasat edildiği ay
  // sonraki ürün ekilebilir. Ekim ve hasat ayı aynıysa ürün tarlada 1 ay kalmış sayılır.
  // "Nadas (boş yıl)" satırı 12 ay ürünsüz sayılır. Hesap js/rotation.js'teki ortak takvimden gelir.
  // Yalnızca nadas girilmişse (hiç ürün yoksa) null döner.
  rotationSpan(periods) {
    const tl = Rotation.timeline(periods);
    return tl ? { years: tl.months / 12, months: tl.months, bare: tl.bare } : null;
  },

  periodText(p) {
    if (p.crop === FALLOW) return t("fallowShort");
    const names = t("months").map(m => m.slice(0, 3));
    if (p.crop === OTHER) return `${Rotation.otherCrop(p).name[LANG]} (${names[p.sow - 1]}–${names[p.harvest - 1]})`;
    return `${cropName(p.crop)} (${names[p.sow - 1]}–${names[p.harvest - 1]})`;
  },

  // "Devam"dan sonra görünen bölümler: yanıt özeti ve rotasyon seçenekleri
  hideResults() {
    this.submitted = false;
    el("planSummary").hidden = true;
    el("planOptions").hidden = true;
    // Aşama 4: sonuçlar gizlenince "gelecek iklim" kaydırıcıları bugüne döner
    Cards.state = null;
    Future.reset();
    Future.renderSticky();
  },

  showResults() {
    this.renderSummary();
    el("planSummary").hidden = false;
    Cards.render(this.answers.rotation.filter(p => this.isComplete(p)), this.answers, Field.data);
  },

  fillSelect(select, placeholder, options, value) {
    select.innerHTML = "";
    [["", placeholder], ...options].forEach(([v, label]) => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = label;
      select.appendChild(opt);
    });
    select.value = value === null ? "" : String(value);
  },

  renderRotation() {
    const box = el("rotationRows");
    box.innerHTML = "";
    const crops = CROPS
      .map(c => [c.id, c.name[LANG]])
      .sort((a, b) => a[1].localeCompare(b[1], LANG));
    crops.unshift([FALLOW, t("fallowOption")]); // "Nadas (boş yıl)" listenin başında
    crops.push([OTHER, t("otherOption")]);      // "Diğer (listede yok)" listenin sonunda
    const months = t("months").map((m, i) => [String(i + 1), m]);

    this.answers.rotation.forEach((p, i) => {
      const row = document.createElement("div");
      row.className = "rot-row";
      row.dataset.index = i;
      row.innerHTML = `<span class="rot-n">${i + 1}</span>
        <label class="rot-f rot-crop"><span class="rot-l"></span><select data-rot="crop"></select></label>
        <label class="rot-f"><span class="rot-l"></span><select data-rot="sow"></select></label>
        <label class="rot-f"><span class="rot-l"></span><select data-rot="harvest"></select></label>
        <label class="rot-f rot-name" hidden><span class="rot-l"></span><input type="text" data-rot="name" maxlength="40" autocomplete="off"></label>
        <button type="button" class="icon-btn rot-del" data-rot="del">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
        <p class="rot-warn" hidden></p>
        <p class="rot-fallow-note" hidden></p>`;
      row.querySelector(".rot-warn").textContent = t("sameMonthWarn");
      this.showRowWarning(row, p);
      // Nadas satırında ay sorulmaz
      if (p.crop === FALLOW) {
        row.classList.add("rot-fallow");
        row.querySelector(".rot-fallow-note").hidden = false;
        row.querySelector(".rot-fallow-note").textContent = t("fallowNote");
      }
      // "Diğer" satırında çiftçi ürünün adını yazar
      if (p.crop === OTHER) {
        row.classList.add("rot-other");
        const name = row.querySelector(".rot-name");
        name.hidden = false;
        name.querySelector("input").value = p.name || "";
        name.querySelector("input").placeholder = t("otherNamePlaceholder");
      }
      const labels = row.querySelectorAll(".rot-l");
      labels[0].textContent = t("cropLabel");
      labels[1].textContent = t("sowLabel");
      labels[2].textContent = t("harvestLabel");
      labels[3].textContent = t("otherNameLabel");
      row.querySelector(".rot-del").setAttribute("aria-label", t("removePeriod"));
      this.fillSelect(row.querySelector("[data-rot='crop']"), t("cropChoose"), crops, p.crop);
      this.fillSelect(row.querySelector("[data-rot='sow']"), t("monthChoose"), months, p.sow);
      this.fillSelect(row.querySelector("[data-rot='harvest']"), t("monthChoose"), months, p.harvest);
      box.appendChild(row);
    });

    el("addPeriod").disabled = this.answers.rotation.length >= MAX_PERIODS;
    this.renderRotationInfo();
  },

  // Ekim ve hasat ayı aynıysa satırın altında soru sorulur; form engellenmez
  showRowWarning(row, p) {
    row.querySelector(".rot-warn").hidden = !(p.sow && p.sow === p.harvest);
  },

  renderRotationInfo() {
    const done = this.answers.rotation.filter(p => this.isComplete(p));
    const span = this.rotationSpan(done);
    el("rotationInfo").hidden = !span;
    if (span) el("rotationInfo").textContent = I18N[LANG].rotationInfo(span);
    // Ürüne göre aylar: yalnızca plan açıkken ve iklim verisi varken çizilir (nadas satırları hariç)
    Calendar.renderCrops(this.isOpen() ? done.filter(p => p.crop !== FALLOW) : [], Field.data, this.answers.water);
  },

  addPeriod() {
    if (this.answers.rotation.length >= MAX_PERIODS) return;
    this.answers.rotation.push(this.blankPeriod());
    this.afterRotationChange();
    const rows = el("rotationRows").querySelectorAll("[data-rot='crop']");
    rows[rows.length - 1].focus();
  },

  // Tek dönem kaldıysa satır silinmez, boşaltılır (formda her zaman en az bir satır durur)
  removePeriod(index) {
    if (this.answers.rotation.length > 1) this.answers.rotation.splice(index, 1);
    else this.answers.rotation = [this.blankPeriod()];
    this.afterRotationChange();
  },

  afterRotationChange() {
    this.save();
    this.renderRotation();
    this.afterAnswerChange();
  },

  afterAnswerChange() {
    el("formError").hidden = true;
    this.renderRotationInfo(); // su durumu değişince yağış cümlesi de değişir
    if (!this.submitted) return;
    // Özet açıkken rotasyon eksik hâle geldiyse özeti ve seçenekleri gizle; değilse yeniden hesapla
    if (this.rotationProblem()) this.hideResults();
    else this.showResults();
  },

  // ---------- Form ----------
  renderForm() {
    this.renderRotation();

    const opts = t("opts");
    Object.keys(PLAN_QUESTIONS).forEach(q => {
      const box = el(`${q}Choices`);
      box.innerHTML = "";
      PLAN_QUESTIONS[q].forEach(value => {
        const label = document.createElement("label");
        label.className = "choice";
        label.innerHTML = `<input type="radio" name="${q}" value="${value}">
          <span class="choice-title"></span><span class="choice-help"></span>`;
        label.querySelector("input").checked = this.answers[q] === value;
        label.querySelector(".choice-title").textContent = opts[q][value][0];
        label.querySelector(".choice-help").textContent = opts[q][value][1];
        box.appendChild(label);
      });
    });

    const list = el("prioList");
    list.innerHTML = "";
    PLAN_PRIORITIES.forEach(p => {
      const label = document.createElement("label");
      label.className = "prio";
      label.innerHTML = `<span class="prio-name"></span>
        <input type="range" min="1" max="5" step="1" name="prio_${p}">
        <span class="prio-val"></span>`;
      label.querySelector(".prio-name").textContent = t("prio")[p];
      label.querySelector("input").value = this.answers.prio[p];
      label.querySelector(".prio-val").textContent = `${this.answers.prio[p]} / 5`;
      list.appendChild(label);
    });

    // Kolay satılan ürünler: çoklu seçim (Aşama 3'te satılabilirlik puanı ve "Pazar odaklı" seçenek için)
    const sell = el("sellChoices");
    sell.innerHTML = "";
    CROPS.map(c => [c.id, c.name[LANG]]).sort((a, b) => a[1].localeCompare(b[1], LANG)).forEach(([id, name]) => {
      const label = document.createElement("label");
      label.className = "chip";
      label.innerHTML = `<input type="checkbox" name="sell" value="${id}"><span></span>`;
      label.querySelector("input").checked = this.answers.sell.includes(id);
      label.querySelector("span").textContent = name;
      sell.appendChild(label);
    });

    FieldCheck.render(); // tarla testi paneli açıksa metinleri (dil, sıfırlama) yenilenir
  },

  onInput(input) {
    if (input.dataset.rot) {
      const period = this.answers.rotation[Number(input.closest(".rot-row").dataset.index)];
      const key = input.dataset.rot;
      const wasFallow = period.crop === FALLOW, wasOther = period.crop === OTHER;
      if (key === "name") period.name = input.value;
      else period[key] = input.value === "" ? null : key === "crop" ? input.value : Number(input.value);
      if (period.crop === FALLOW) { period.sow = null; period.harvest = null; }
      if (period.crop !== OTHER) delete period.name;
      // Nadasa/nadastan ya da "Diğer"e/"Diğer"den geçişte satır yeniden çizilir (ay kutuları ya da ad kutusu gizlenir/görünür)
      if (key === "crop" && (wasFallow || period.crop === FALLOW || wasOther || period.crop === OTHER)) this.renderRotation();
      else { this.showRowWarning(input.closest(".rot-row"), period); this.renderRotationInfo(); }
    } else if (input.type === "checkbox" && input.name === "sell") {
      this.answers.sell = [...el("sellChoices").querySelectorAll("input:checked")].map(i => i.value);
    } else if (input.type === "radio" && input.name in PLAN_QUESTIONS) {
      this.answers[input.name] = input.value;
    } else if (input.type === "range" && input.name.startsWith("prio_")) {
      const p = input.name.slice(5);
      this.answers.prio[p] = Number(input.value);
      input.parentElement.querySelector(".prio-val").textContent = `${input.value} / 5`;
    } else {
      return;
    }
    this.save();
    this.afterAnswerChange();
  },

  // Rotasyon girişi geçerli mi: en az bir tam ÜRÜN dönemi olmalı (yalnızca nadas yetmez),
  // yarım bırakılmış dönem olmamalı
  rotationProblem() {
    const rows = this.answers.rotation;
    const partial = rows.some(p => !this.isComplete(p) && !this.isEmpty(p));
    return partial || !rows.some(p => this.isComplete(p) && p.crop !== FALLOW);
  },

  submit() {
    const showError = (key, target) => {
      el("formError").textContent = t(key);
      el("formError").hidden = false;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    if (this.rotationProblem()) return showError("formErrorRotation", el("rotationRows"));
    const missing = Object.keys(PLAN_QUESTIONS).filter(q => !this.answers[q]);
    if (missing.length) return showError("formError", el(`${missing[0]}Choices`));

    // Tamamen boş bırakılmış fazladan satırları at
    this.answers.rotation = this.answers.rotation.filter(p => this.isComplete(p));
    this.save();
    this.renderRotation();

    this.submitted = true;
    this.showResults();
    el("planSummary").scrollIntoView({ behavior: "smooth", block: "start" });
  },

  renderSummary() {
    const a = this.answers, opts = t("opts"), short = t("summaryLabels");
    const done = a.rotation.filter(p => this.isComplete(p));
    const rows = [[short.rotation, done.map(p => this.periodText(p)).join(" → ")]];
    Object.keys(PLAN_QUESTIONS).forEach(q => rows.push([short[q], opts[q][a[q]][0]]));
    PLAN_PRIORITIES.forEach(p => rows.push([t("prio")[p], `${a.prio[p]} / 5`]));
    rows.push([short.sell, a.sell.length ? a.sell.map(cropName).join(", ") : t("sellNone")]);
    const list = el("summaryList");
    list.innerHTML = "";
    rows.forEach(([name, value]) => {
      const dt = document.createElement("dt"), dd = document.createElement("dd");
      dt.textContent = name;
      dd.textContent = value;
      list.append(dt, dd);
    });
  },

  reset() {
    this.answers = this.blank();
    try { localStorage.removeItem(PLAN_KEY); } catch {}
    this.hideResults();
    el("formError").hidden = true;
    FieldCheck.step = 0;
    this.renderForm();
    toast(t("answersCleared"));
  },

  refreshLanguage() {
    this.renderForm();
    if (!this.isOpen()) return;
    this.renderHead();
    Calendar.render(Field.data);
    if (this.submitted) this.showResults();
  }
};

// ---------- 5 dakikalık tarla testi ("5-minute field check") ----------
// Toprak/su/eğim sorularının üstündeki adım adım rehber (#fieldCheck). Toprak dokusu ve eğim cevabı formdaki MEVCUT
// soruyu doldurur (çiftçi elle seçmiş gibi); drenaj ve "geçen yıl" cevapları yalnızca kaydedilir (answers.check).
// Yeni bir puanlama kuralı DEĞİLDİR: answers.check hiçbir hesapta okunmaz. Metinler i18n.js'te "fc" altında.
const FC_TEXTURE = ["sandy", "loam", "clay"];
const FC_DRAIN = ["often", "sometimes", "no"];
const FC_YIELD = ["good", "mid", "poor"];
const FC_PROBLEMS = ["drought", "waterlog", "pest", "disease", "none"];
const FC_STEPS = 4;

const FieldCheck = {
  step: 0, // 0–3: adımlar; 4: sonuç ekranı

  blank() {
    return { texture: null, drain: null, slope: null, lastCrop: null, lastYield: null, problems: [] };
  },

  isEmpty(c) {
    return !c || !(c.texture || c.drain || c.slope || c.lastCrop || c.lastYield || c.problems.length);
  },

  // Saklanmış cevapları denetler; tanınmayan değerleri yok sayar. Hiç cevap yoksa null döner.
  clean(s) {
    if (!s || typeof s !== "object") return null;
    const c = this.blank(), pick = (list, v) => (list.includes(v) ? v : null);
    c.texture = pick(FC_TEXTURE, s.texture);
    c.drain = pick(FC_DRAIN, s.drain);
    c.slope = pick(PLAN_QUESTIONS.slope, s.slope);
    c.lastCrop = s.lastCrop === FALLOW || CROPS.some(x => x.id === s.lastCrop) ? s.lastCrop : null;
    c.lastYield = pick(FC_YIELD, s.lastYield);
    if (Array.isArray(s.problems)) c.problems = FC_PROBLEMS.filter(p => s.problems.includes(p));
    return this.isEmpty(c) ? null : c;
  },

  // Kayıtlı cevapların [etiket, değer] satırları (sonuç ekranı ve profildeki "Tarla testi" kartı aynı listeyi kullanır)
  rows(c) {
    const rows = [];
    if (this.isEmpty(c)) return rows;
    const F = t("fc"), opts = t("opts");
    if (c.texture) rows.push([F.rows.texture, opts.soil[c.texture][0]]);
    if (c.drain) rows.push([F.rows.drain, F.drain[c.drain]]);
    if (c.slope) rows.push([F.rows.slope, opts.slope[c.slope][0]]);
    if (c.lastCrop) rows.push([F.rows.lastCrop, c.lastCrop === FALLOW ? t("fallowShort") : cropName(c.lastCrop)]);
    if (c.lastYield) rows.push([F.rows.lastYield, F.yield[c.lastYield]]);
    if (c.problems.length) rows.push([F.rows.problems, c.problems.map(p => F.problems[p]).join(", ")]);
    return rows;
  },

  init() {
    const btn = el("fieldCheckBtn"), panel = el("fieldCheckPanel");
    if (!btn || !panel) return; // tarayıcı eski bir index.html'i önbellekten açtıysa site yine de çalışsın
    btn.addEventListener("click", () => this.toggle(panel.hidden));
    panel.addEventListener("click", e => {
      const b = e.target.closest("button");
      if (b) this.onClick(b);
    });
    panel.addEventListener("change", e => {
      if (e.target.dataset.fc === "lastCrop") this.set("lastCrop", e.target.value || null);
    });
  },

  toggle(open) {
    el("fieldCheckPanel").hidden = !open;
    el("fieldCheckBtn").setAttribute("aria-expanded", String(open));
    if (open) this.render();
  },

  data() {
    return Plan.answers.check || this.blank();
  },

  set(key, value) {
    const c = this.data();
    if (key === "problems") {
      // Birden fazla seçilebilir; "Yok" diğerleriyle birlikte seçilemez
      const had = c.problems.includes(value);
      let list = had ? c.problems.filter(p => p !== value) : [...c.problems, value];
      if (!had) list = value === "none" ? ["none"] : list.filter(p => p !== "none");
      c.problems = FC_PROBLEMS.filter(p => list.includes(p));
    } else {
      c[key] = value;
    }
    if (this.isEmpty(c)) delete Plan.answers.check;
    else Plan.answers.check = c;

    // Toprak dokusu ve eğim: formdaki mevcut soruyu doldurur (çiftçi aşağıdan değiştirebilir)
    const q = key === "texture" ? "soil" : key === "slope" ? "slope" : null;
    if (q && value) {
      Plan.answers[q] = value;
      const radio = document.querySelector(`#${q}Choices input[value="${value}"]`);
      if (radio) radio.checked = true;
    }
    Plan.save();
    if (q && value) Plan.afterAnswerChange(); // elle seçilmiş gibi: sonuçlar açıksa yeniden hesaplanır
  },

  onClick(b) {
    const act = b.dataset.act, key = b.dataset.fc, val = b.dataset.val;
    if (act === "back") this.step = Math.max(0, this.step - 1);
    else if (act === "next") this.step = Math.min(FC_STEPS, this.step + 1);
    else if (act === "again") this.step = 0;
    else if (act === "close") { this.toggle(false); el("fieldCheckBtn").focus(); return; }
    else if (key) this.set(key, val);
    else return;
    this.render();
    // Panel yeniden çizildiği için klavye odağı aynı seçeneğe (ya da panelin başına) geri verilir
    const panel = el("fieldCheckPanel");
    const again = key ? panel.querySelector(`[data-fc="${key}"][data-val="${val}"]`) : panel.querySelector(".fc-title");
    if (again) again.focus({ preventScroll: true });
  },

  render() {
    const panel = el("fieldCheckPanel");
    if (!panel || panel.hidden) return;
    const F = t("fc"), opts = t("opts"), short = t("summaryLabels"), c = this.data(), s = this.step;
    const add = (parent, tag, cls, text) => {
      const n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text !== undefined) n.textContent = text;
      parent.appendChild(n);
      return n;
    };
    const option = (parent, key, val, title, help, on) => {
      const b = add(parent, "button", "fc-opt");
      b.type = "button"; b.dataset.fc = key; b.dataset.val = val;
      b.setAttribute("aria-pressed", String(on));
      add(b, "span", "fc-opt-title", title);
      if (help) add(b, "span", "fc-opt-help", help);
    };
    const navBtn = (parent, act, cls, text) => {
      const b = add(parent, "button", `btn ${cls}`, text);
      b.type = "button"; b.dataset.act = act;
    };

    panel.innerHTML = "";
    const title = add(panel, "h4", "fc-title", F.title);
    title.tabIndex = -1;

    if (s >= FC_STEPS) {
      // Sonuç ekranı: kaydedilen cevaplar + "saha gözlemi" notu
      add(panel, "p", "fc-step", F.doneTitle);
      const rows = this.rows(Plan.answers.check);
      if (!rows.length) add(panel, "p", "fc-fine", F.doneEmpty);
      else {
        const dl = add(panel, "dl", "fc-facts");
        rows.forEach(([k, v]) => { add(dl, "dt", "", k); add(dl, "dd", "", v); });
        add(panel, "p", "fc-fine", F.doneHint);
      }
      add(panel, "p", "fc-note", F.note);
      const nav = add(panel, "div", "fc-nav");
      navBtn(nav, "back", "btn-soft", F.back);
      navBtn(nav, "again", "btn-soft", F.again);
      navBtn(nav, "close", "btn-primary", F.close);
    } else {
      add(panel, "p", "fc-step", `${F.step(s + 1, FC_STEPS)} · ${F.heads[s]}`);
      add(panel, "p", "fc-task", F.tasks[s]);
      const box = add(panel, "div", "fc-opts");
      if (s === 0) {
        FC_TEXTURE.forEach(v => option(box, "texture", v, F.texture[v], `→ ${opts.soil[v][0]}`, c.texture === v));
        if (c.texture) add(panel, "p", "fc-filled", F.filled(short.soil, opts.soil[c.texture][0]));
      } else if (s === 1) {
        FC_DRAIN.forEach(v => option(box, "drain", v, F.drain[v], "", c.drain === v));
        add(panel, "p", "fc-fine", F.drainNote);
      } else if (s === 2) {
        PLAN_QUESTIONS.slope.forEach(v => option(box, "slope", v, opts.slope[v][0], opts.slope[v][1], c.slope === v));
        if (c.slope) add(panel, "p", "fc-filled", F.filled(short.slope, opts.slope[c.slope][0]));
      } else {
        // Geçen yıl: ürün (listeden), verim, yaşanan sorunlar (çoklu). Yalnızca kayıt.
        box.className = "fc-groups";
        const g1 = add(box, "label", "fc-group");
        add(g1, "span", "fc-label", F.lastCrop);
        const sel = add(g1, "select", "fc-select");
        sel.dataset.fc = "lastCrop";
        const crops = CROPS.map(x => [x.id, x.name[LANG]]).sort((a, b) => a[1].localeCompare(b[1], LANG));
        crops.unshift([FALLOW, t("fallowOption")]);
        Plan.fillSelect(sel, t("cropChoose"), crops, c.lastCrop);
        const g2 = add(box, "div", "fc-group");
        add(g2, "span", "fc-label", F.lastYield);
        const y = add(g2, "div", "fc-opts fc-row");
        FC_YIELD.forEach(v => option(y, "lastYield", v, F.yield[v], "", c.lastYield === v));
        const g3 = add(box, "div", "fc-group");
        add(g3, "span", "fc-label", F.lastProblems);
        const pr = add(g3, "div", "fc-opts fc-row");
        FC_PROBLEMS.forEach(v => option(pr, "problems", v, F.problems[v], "", c.problems.includes(v)));
      }
      const nav = add(panel, "div", "fc-nav");
      if (s > 0) navBtn(nav, "back", "btn-soft", F.back);
      navBtn(nav, "next", "btn-primary", s === FC_STEPS - 1 ? F.finish : F.next);
    }
    add(panel, "p", "fc-src", F.source);
  }
};
