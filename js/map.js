// Harita: altlık (kara/su) + NASA GIBS veri katmanı + sınırlar + yer adları.
// Tarih değişirken titreme olmasın diye yeni katman yüklenince eskisi kaldırılır.

// Altlık ve sınırlar: NASA GIBS'in zamandan bağımsız katmanları (tarih yerine "default" yazılır).
// Kimlikler ve karo seti 14 Kasım 2026'da GIBS kataloğundan kontrol edildi.
// Not: "_15m" ile biten sürümler bu adreste boş karo döndürüyor; kullanmayın.
const GIBS_STATIC = "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/{layer}/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png";
const BASEMAP = {
  base: GIBS_STATIC.replace("{layer}", "OSM_Land_Water_Map"),
  borders: GIBS_STATIC.replace("{layer}", "Reference_Features"),
  labels: GIBS_STATIC.replace("{layer}", "Reference_Labels") // yakın görünümde az yer adı var; kullanıcı yerini aramayla bulur
};

const MAP_ATTRIBUTION = 'Base map: <a href="https://earthdata.nasa.gov/gibs">NASA GIBS</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' +
  ' | Data: <a href="https://earthdata.nasa.gov/gibs">NASA GIBS</a>, <a href="https://power.larc.nasa.gov/">NASA POWER</a>';

const MapView = {
  map: null,
  current: null,     // ekranda görünen GIBS katmanı
  pending: null,     // yüklenmekte olan GIBS katmanı
  pin: null,         // seçilen tarla işareti
  onTileError: null,
  onPick: null,      // haritaya tıklanınca çağrılır (lat, lng)

  init() {
    this.map = L.map("map", {
      center: [20, 10],
      zoom: 3,
      minZoom: 2,
      maxZoom: 11,
      zoomControl: false,
      worldCopyJump: true
    });
    L.control.zoom({ position: "bottomleft" }).addTo(this.map);

    // Altlık: kara ve su (en altta). "basemap-tiles" sınıfı css/style.css'te altlığı açık griye çevirir.
    L.tileLayer(BASEMAP.base, { attribution: MAP_ATTRIBUTION, maxNativeZoom: 9, maxZoom: 11, className: "basemap-tiles" }).addTo(this.map);

    // Renkleri çevrilen veri katmanları (şimdilik yalnızca Yeraltı suyu) için ayrı bölme. Kırmızı–mavi yer
    // değiştiren süzgeç her karoya değil, bu bölmeye BİR KEZ uygulanır (css/style.css, .leaflet-flip-pane).
    this.map.createPane("flip");
    this.map.getPane("flip").style.zIndex = 250; // altlık ve diğer veri katmanlarının üstü, sınır ve adların altı
    this.map.getPane("flip").style.pointerEvents = "none";

    // Sınırlar ve yer adları veri katmanının üstünde kalsın
    this.map.createPane("labels");
    this.map.getPane("labels").style.zIndex = 450;
    this.map.getPane("labels").style.pointerEvents = "none";
    L.tileLayer(BASEMAP.borders, { pane: "labels", maxNativeZoom: 9, maxZoom: 11 }).addTo(this.map);
    L.tileLayer(BASEMAP.labels, { pane: "labels", maxNativeZoom: 9, maxZoom: 11 }).addTo(this.map);

    this.map.on("click", e => {
      if (this.onPick) this.onPick(e.latlng.lat, e.latlng.lng);
    });
  },

  // Seçilen tarlayı işaretle ve oraya yaklaş
  setPin(lat, lng, fly = true) {
    const icon = L.divIcon({ className: "", html: '<div class="field-pin"></div>', iconSize: [22, 22], iconAnchor: [11, 11] });
    if (this.pin) this.pin.setLatLng([lat, lng]);
    else this.pin = L.marker([lat, lng], { icon, keyboard: false }).addTo(this.map);
    if (fly) this.map.flyTo([lat, lng], Math.max(this.map.getZoom(), 7), { duration: 1.2 });
  },

  // Tarla işaretini haritanın solundan x piksel uzaklığa getirir (x verilmezse ortaya)
  focusPin(x) {
    if (!this.pin) return;
    const zoom = Math.max(this.map.getZoom(), 7);
    const size = this.map.getSize();
    const shift = size.x / 2 - (x === undefined ? size.x / 2 : x);
    const target = this.map.project(this.pin.getLatLng(), zoom).add([shift, 0]);
    this.map.setView(this.map.unproject(target, zoom), zoom, { animate: true });
  },

  clearPin() {
    if (this.pin) { this.map.removeLayer(this.pin); this.pin = null; }
  },

  // Son istenen katmanın karoları hâlâ yükleniyor mu? Oynatma, karolar gelmeden sıradaki aya geçmemek için bakar.
  // (Leaflet "load" olayını karoların hepsi gelince ya da hata verince tetikler; o zaman pending boşalır.)
  busy() {
    return Boolean(this.map && this.pending);
  },

  // Katmanı verilen tarihe göre göster
  show(layer, time) {
    const url = GIBS_URL
      .replace("{layer}", layer.gibs)
      .replace("{time}", time)
      .replace("{tms}", layer.tms)
      .replace("{ext}", layer.ext);

    if (this.pending) {
      this.map.removeLayer(this.pending);
      this.pending = null;
    }

    const next = L.tileLayer(url, {
      maxNativeZoom: layer.maxZoom,
      maxZoom: 11,
      opacity: 0,
      pane: layer.flip ? "flip" : "tilePane",
      bounds: [[-85, -180], [85, 180]]
    });

    let errors = 0;
    next.on("tileerror", () => {
      errors++;
      if (errors === 3 && this.onTileError) this.onTileError();
    });

    next.once("load", () => {
      next.setOpacity(0.75);
      if (this.current && this.current !== next) this.map.removeLayer(this.current);
      this.current = next;
      if (this.pending === next) this.pending = null;
    });

    this.pending = next;
    next.addTo(this.map);
  }
};
