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
