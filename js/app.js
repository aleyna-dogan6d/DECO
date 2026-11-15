// Uygulamanın akışı: tarla seçimi, katmanlar, zaman çizelgesi, dil. (Sayfalar ve menü js/pages.js'te.)

const State = {
  layer: LAYERS[0],
  frames: [],     // [{ y, m, time }]
  index: 0,
  playing: false,
  timer: null,
  showMore: false
};

const isMobile = () => window.matchMedia("(max-width: 860px)").matches;

// ---------- Katmanlar ----------
function layerButton(layer) {
  const btn = document.createElement("button");
  btn.className = "layer-btn" + (layer === State.layer ? " active" : "");
  btn.innerHTML = `
    <span class="layer-ic" style="background:${layer.tint};color:${layer.ink}">${ICONS[layer.icon]}</span>
    <span><span class="layer-name"></span><span class="layer-years">${layerYears(layer)}</span></span>`;
  btn.querySelector(".layer-name").textContent = layer.title[LANG];
  btn.addEventListener("click", () => selectLayer(layer));
  return btn;
}

function renderLayerList() {
  const main = el("layerList"), more = el("moreList");
  main.innerHTML = "";
  more.innerHTML = "";
  LAYERS.forEach(layer => {
    // Mobilde tüm katmanlar tek sırada; masaüstünde ek katmanlar "Daha fazla" altında
    const target = layer.more && !isMobile() ? more : main;
    target.appendChild(layerButton(layer));
  });
  const activeIsMore = State.layer.more;
  more.hidden = !(State.showMore || activeIsMore);
  el("moreBtn").textContent = more.hidden ? t("moreLayers") : t("lessLayers");
}

function renderInfo() {
  const layer = State.layer;
  el("infoIcon").innerHTML = ICONS[layer.icon];
  el("infoIcon").style.background = layer.tint;
  el("infoIcon").style.color = layer.ink;
  el("infoTitle").textContent = layer.title[LANG];
  el("infoPlain").textContent = layer.plain[LANG];
  el("infoScience").textContent = layer.science[LANG];
  el("infoSource").textContent = `${t("source")}: ${layer.source}`;
  el("infoLegend").innerHTML = `
    <div class="legend-bar" style="background:${layer.color}"></div>
    <div class="legend-labels"><span></span><span></span></div>`;
  const labels = el("infoLegend").querySelectorAll(".legend-labels span");
  labels[0].textContent = layer.legend[LANG][0];
  labels[1].textContent = layer.legend[LANG][1];
}

function selectLayer(layer) {
  const prev = State.frames[State.index];
  State.layer = layer;
  State.frames = buildFrames(layer);

  // Aynı aya ya da ondan önceki en yakın kareye git
  let idx = State.frames.length - 1;
  if (prev) {
    const key = prev.y * 12 + prev.m;
    const found = State.frames.findLastIndex(f => f.y * 12 + f.m <= key);
    idx = found >= 0 ? found : 0;
  }

  el("timeSlider").max = State.frames.length - 1;
  renderRange();
  renderLayerList();
  renderInfo();
  goTo(idx);
}

// ---------- Zaman çizelgesi ----------
function renderRange() {
  const a = State.frames[0], b = State.frames[State.frames.length - 1];
  el("rangeStart").textContent = `${t("months")[a.m - 1].slice(0, 3)} ${a.y}`;
  el("rangeEnd").textContent = `${t("months")[b.m - 1].slice(0, 3)} ${b.y}`;
}

function goTo(idx) {
  State.index = Math.max(0, Math.min(idx, State.frames.length - 1));
  const f = State.frames[State.index];
  el("timeSlider").value = State.index;
  el("tlYear").textContent = f.y;
  el("tlMonth").textContent = t("months")[f.m - 1];
  if (MapView.map) MapView.show(State.layer, f.time); // harita ilk kez plan sayfası açılınca kurulur (startMap)
  Field.setYear(f.y);
}

function setPlaying(on) {
  State.playing = on;
  clearInterval(State.timer);
  el("playIcon").innerHTML = on
    ? '<path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor"/>'
    : '<path d="M8 5v14l11-7z" fill="currentColor"/>';
  el("playLabel").textContent = on ? t("pause") : t("play");
  el("playBtn").setAttribute("aria-label", on ? t("pause") : t("play"));
  if (!on) return;
  if (State.index >= State.frames.length - 1) goTo(0);
  State.timer = setInterval(() => {
    if (State.index >= State.frames.length - 1) return setPlaying(false);
    goTo(State.index + 1);
  }, Number(el("speedSel").value));
}

// ---------- Harita ----------
// Harita, plan sayfası ilk kez açılınca kurulur: ana sayfayı okuyan biri için harita karoları boşuna indirilmez.
function startMap() {
  if (MapView.map) return;
  MapView.init();
  goTo(State.index);
}

// ---------- Tarla seçimi ----------
function pickField(lat, lng, name = null) {
  Plan.close(); // yeni bir yer seçilince plan ekranı kapanır; yanıtlar saklı kalır
  MapView.setPin(lat, lng);
  Field.select(lat, lng, name);
  // Tarla kartına yer açmak için katman açıklamasını küçült (tıklayınca tekrar açılır)
  el("infoCard").classList.add("collapsed");
  el("infoToggle").setAttribute("aria-expanded", "false");
  // Telefonda tarla kartı haritanın altındadır: kartın başı (ad ve iklim özeti) ekrana girecek kadar,
  // haritayı olabildiğince görünür bırakarak sayfa aşağı kaydırılır
  if (isMobile()) requestAnimationFrame(() => {
    const need = el("fieldCard").getBoundingClientRect().top - (window.innerHeight - 190);
    if (need > 0) window.scrollBy({ top: need, behavior: "smooth" });
  });
}

function locate() {
  if (!navigator.geolocation) return toast(t("locateError"));
  toast(t("locating"));
  navigator.geolocation.getCurrentPosition(
    pos => pickField(pos.coords.latitude, pos.coords.longitude),
    () => toast(t("locateError")),
    { enableHighAccuracy: false, timeout: 10000 }
  );
}

// ---------- Genel ----------
function toast(msg) {
  const box = el("toast");
  box.textContent = msg;
  box.classList.add("show");
  clearTimeout(box._t);
  box._t = setTimeout(() => box.classList.remove("show"), 3000);
}

function setLang(lang) {
  LANG = lang;
  el("langSel").value = lang;
  applyI18n();
  renderLayerList();
  renderInfo();
  renderRange();
  goTo(State.index);
  setPlaying(State.playing);
  Field.refreshLanguage();
  Plan.refreshLanguage();
  Pages.refreshLanguage();
}

document.addEventListener("DOMContentLoaded", () => {
  el("langSel").value = LANG;
  applyI18n();
  MapView.onTileError = () => { if (!State.playing) toast(t("tileError")); };
  MapView.onPick = (lat, lng) => pickField(lat, lng);
  Search.init();
  Plan.init();

  el("timeSlider").addEventListener("input", e => { setPlaying(false); goTo(Number(e.target.value)); });
  el("playBtn").addEventListener("click", () => setPlaying(!State.playing));
  el("speedSel").addEventListener("change", () => { if (State.playing) setPlaying(true); });
  el("langSel").addEventListener("change", e => setLang(e.target.value));
  el("locateBtn").addEventListener("click", locate);
  el("fieldClose").addEventListener("click", () => { Field.close(); el("infoCard").classList.remove("collapsed"); });
  el("createRotation").addEventListener("click", () => {
    // İklim verisi gelmeden plan açılamaz (takvim o veriden çiziliyor)
    if (Field.data && Field.data.years.length >= 10) Plan.open();
    else toast(el("fieldStatus").textContent || t("loadingClimate"));
  });
  el("moreBtn").addEventListener("click", () => { State.showMore = !State.showMore; renderLayerList(); });
  el("infoToggle").addEventListener("click", () => {
    const card = el("infoCard");
    card.classList.toggle("collapsed");
    el("infoToggle").setAttribute("aria-expanded", !card.classList.contains("collapsed"));
  });
  document.querySelectorAll(".seg-btn").forEach(b => b.addEventListener("click", () => Field.setChartKind(b.dataset.chart)));
  window.addEventListener("resize", renderLayerList);

  selectLayer(LAYERS[0]);
  Profile.init(); // tarla profili prototipi (yalnızca bu tarayıcıda saklanır)
  Pages.init(); // menü ve sayfalar; adres "#plan" değilse harita gizli başlar
});
