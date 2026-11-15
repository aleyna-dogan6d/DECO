// AI disclosure: written with AI assistance (Anthropic Claude, via Claude Code); reviewed and edited by the DECO team.
// NASA GIBS harita katmanları.
// Tüm katmanlar dünya genelini kapsar.
// Katman adları ve tarih aralıkları GIBS kataloğundan (WMTSCapabilities) kontrol edildi: 14 Kasım 2026.
// Her katman: GIBS kimliği, karo seti, kareler (aylık tarih listesi),
// halk dilinde açıklama ("plain"), bilimsel detay ("science") ve renk göstergesi ("color").
// Gösterge renkleri GIBS'in resmi renk skalası dosyalarından alındı (14 Kasım 2026):
//   https://gibs.earthdata.nasa.gov/colormaps/v1.3/<ad>.xml  (adresler katalogdaki ows:Metadata satırlarından)
// Her skaladan, resmi sırasıyla eşit aralıklı 11 renk örneklendi. Katman değiştirirken ya da eklerken
// renkleri ve "plain" metnindeki renk adlarını yine o dosyadan kontrol edin; hafızadan yazmayın.

const GIBS_URL = "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/{layer}/default/{time}/{tms}/{z}/{y}/{x}.{ext}";

// GRACE / GRACE-FO ölçüm tarihleri düzensiz; 2017-06 ile 2018-05 arasında iki uydu arasındaki boşluk var.
const GRACE_DATES = ["2002-04-04","2002-05-02","2002-08-01","2002-09-01","2002-10-01","2002-11-01","2002-12-01","2003-01-01","2003-02-01","2003-03-01","2003-04-01","2003-05-01","2003-07-01","2003-08-01","2003-09-01","2003-10-01","2003-11-01","2003-12-01","2004-01-01","2004-02-04","2004-03-01","2004-04-01","2004-05-01","2004-06-01","2004-07-01","2004-08-01","2004-09-01","2004-10-01","2004-11-01","2004-12-01","2005-01-01","2005-02-01","2005-03-01","2005-04-01","2005-05-01","2005-06-01","2005-07-01","2005-08-01","2005-09-01","2005-10-01","2005-11-01","2005-12-01","2006-01-01","2006-02-01","2006-03-01","2006-04-01","2006-05-01","2006-06-01","2006-07-01","2006-08-01","2006-09-01","2006-10-01","2006-11-01","2006-12-01","2007-01-01","2007-02-01","2007-03-01","2007-04-01","2007-05-01","2007-06-01","2007-07-01","2007-08-01","2007-09-01","2007-10-01","2007-11-01","2007-12-01","2008-01-01","2008-02-01","2008-03-01","2008-04-01","2008-05-01","2008-06-01","2008-07-01","2008-08-01","2008-09-01","2008-10-01","2008-11-01","2008-12-01","2009-01-01","2009-02-01","2009-03-01","2009-04-01","2009-05-01","2009-06-01","2009-07-01","2009-08-01","2009-09-01","2009-10-01","2009-11-01","2009-12-01","2010-01-01","2010-02-01","2010-03-01","2010-04-01","2010-05-01","2010-06-01","2010-07-01","2010-08-01","2010-09-01","2010-10-01","2010-11-01","2010-12-01","2011-02-08","2011-03-01","2011-04-01","2011-05-01","2011-07-05","2011-08-01","2011-09-01","2011-10-01","2011-12-17","2012-01-01","2012-02-01","2012-03-01","2012-06-01","2012-07-01","2012-08-01","2012-09-01","2012-11-06","2012-12-01","2013-01-01","2013-02-01","2013-04-11","2013-05-01","2013-06-01","2013-07-01","2013-10-01","2013-11-01","2013-12-01","2014-01-01","2014-03-01","2014-04-01","2014-05-01","2014-06-01","2014-08-01","2014-09-01","2014-10-01","2014-11-01","2015-01-13","2015-02-01","2015-03-01","2015-04-01","2015-06-29","2015-08-01","2015-09-01","2015-12-12","2016-01-04","2016-03-01","2016-05-08","2016-06-01","2016-07-01","2016-08-08","2016-11-14","2016-12-11","2017-01-07","2017-03-17","2017-04-10","2017-05-02","2018-06-01","2018-07-01","2018-10-22","2018-11-01","2018-12-01","2019-01-01","2019-03-01","2019-04-01","2019-05-01","2019-06-01","2019-07-01","2019-08-01","2019-09-01","2019-10-01","2019-11-01","2019-12-01","2020-01-01","2020-02-01","2020-03-01","2020-04-01","2020-05-01","2020-06-01","2020-07-01","2020-08-01","2020-09-01","2020-10-01","2020-11-01","2020-12-01","2021-01-01","2021-02-01","2021-03-01","2021-04-01","2021-05-01","2021-06-01","2021-07-01","2021-08-01","2021-09-01","2021-10-01","2021-11-01","2021-12-01","2022-01-01","2022-02-01","2022-03-01","2022-04-01","2022-05-01","2022-06-01","2022-07-01"];

const LAYERS = [
  {
    id: "ndvi",
    gibs: "MODIS_Terra_L3_NDVI_Monthly",
    tms: "GoogleMapsCompatible_Level7",
    maxZoom: 7,
    ext: "png",
    start: "2001-01", end: "2026-10", day: 1, skip: ["2025-04"],
    color: "linear-gradient(90deg,#f1ecec,#e5dbcd,#c8b5a5,#b0957d,#9a6e59,#96ba20,#64a601,#438d01,#1d7501,#006001,#001801)",
    title: { tr: "Bitkiler", en: "Plants" },
    icon: "leaf", tint: "#e3f3e6", ink: "#2e7d32",
    plain: {
      tr: "Koyu yeşil yerlerde bitkiler sağlıklı ve gür, açık yeşil yerlerde daha seyrek. Kahverengi ve bej yerlerde toprak çıplak, tarla boş ya da bitki çok az. Yaz aylarını oynatınca hasattan sonra tarlaların nasıl boşaldığını görebilirsiniz.",
      en: "Dark green means healthy, dense plants; light green means thinner growth. Brown and beige mean bare soil, an empty field or very few plants. Play the summer months to see fields empty out after harvest."
    },
    legend: { tr: ["Çıplak toprak (0)", "Gür bitki (1)"], en: ["Bare soil (0)", "Dense plants (1)"] },
    science: {
      tr: "NDVI (Normalleştirilmiş Fark Bitki İndeksi): bitkilerin kırmızı ışığı emip yakın kızılötesi ışığı yansıtmasından hesaplanır. -1 ile +1 arasında değer alır; 0,6 üstü genelde gür bitki demektir. Aylık bileşik görüntü. Renk skalası 0 ile 1 arasını gösterir: yaklaşık 0,3'e kadar bej ve kahverengi, üstü yeşil.",
      en: "NDVI (Normalized Difference Vegetation Index) is computed from how plants absorb red light and reflect near-infrared. Values range from -1 to +1; above 0.6 usually means dense vegetation. Monthly composite. The colour scale covers 0 to 1: beige and brown up to about 0.3, green above."
    },
    source: "NASA MODIS Terra, monthly NDVI (GIBS)"
  },
  {
    id: "soil",
    gibs: "GLDAS_Underground_Soil_Moisture_Monthly",
    tms: "GoogleMapsCompatible_Level6",
    maxZoom: 6,
    ext: "png",
    start: "2001-01", end: "2026-06", day: 1,
    color: "linear-gradient(90deg,#9e0142,#e65848,#f67f4b,#fdae61,#fdd17e,#f0ec92,#d5ee9b,#abdda4,#79c9a4,#4fa9af,#5e4fa2)",
    title: { tr: "Toprak nemi", en: "Soil moisture" },
    icon: "drop", tint: "#f3ebdd", ink: "#8a5a22",
    plain: {
      tr: "Kırmızı ve turuncu yerlerde toprak kuru (en kuru yerler koyu vişne rengi), sarı yerlerde orta, yeşil yerlerde nemli. Maviye dönen yerlerde toprak çok ıslak. Yılları oynatınca bölgenizdeki toprağın zamanla kuruyup kurumadığını görebilirsiniz.",
      en: "Red and orange mean dry soil (the driest places show as dark wine red), yellow is in between, and green means moist. Blue means very wet soil. Play the years to see whether the soil in your area has been drying over time."
    },
    legend: { tr: ["Kuru", "Çok ıslak"], en: ["Dry", "Very wet"] },
    science: {
      tr: "GLDAS, uydu ve yer ölçümlerini bir kara yüzeyi modeliyle birleştirerek toprak nemini hesaplar. Yani doğrudan bir ölçüm değil, model sonucudur. Çözünürlük yaklaşık 25–100 km, bölgesel eğilimi gösterir. Renk skalası 0 ile 50 kg/m² arasını gösterir.",
      en: "GLDAS combines satellite and ground observations with a land surface model to estimate soil moisture, so it is a model output rather than a direct measurement. Resolution ~25–100 km; it shows regional trends. The colour scale covers 0 to 50 kg/m²."
    },
    source: "NASA GLDAS (GIBS)"
  },
  {
    id: "smap",
    gibs: "SMAP_L4_Analyzed_Root_Zone_Soil_Moisture",
    tms: "GoogleMapsCompatible_Level6",
    maxZoom: 6,
    ext: "png",
    start: "2015-04", end: "2026-10", day: 15,
    color: "linear-gradient(90deg,#ffa200,#ffde00,#cae400,#359a00,#00b46a,#00ffff,#0071ff,#0000e6,#00008c,#1e1e64,#505050)",
    title: { tr: "Kök nemi (SMAP uydusu)", en: "Root moisture (SMAP satellite)" },
    icon: "satellite", tint: "#ece9f6", ink: "#5a4b9c", more: true,
    plain: {
      tr: "Bitki köklerinin ulaştığı derinlikteki nem. Turuncu ve sarı yerlerde kökler susuz, yeşil yerlerde orta, açık maviden koyu maviye dönen yerlerde toprak ıslak. Kuru bölgelerde yaz ürünleri daha çok sulama ister.",
      en: "Moisture at the depth plant roots reach. Orange and yellow mean roots are thirsty, green is in between, and light to dark blue means wet soil. Summer crops in dry areas need more irrigation."
    },
    legend: { tr: ["Kuru", "Çok ıslak"], en: ["Dry", "Very wet"] },
    science: {
      tr: "SMAP uydusunun ölçümleri bir toprak modeliyle birleştirilerek kök bölgesindeki (0–100 cm) nem tahmin edilir. Her ayın 15'indeki günlük görüntü gösterilir. Çözünürlük yaklaşık 9 km; tek bir tarlayı değil bölgeyi gösterir. Renk skalası 0 ile 0,7 m³/m³ arasını gösterir (toprağın hacminin ne kadarının su olduğu); 0,7 ve üstü gri.",
      en: "SMAP satellite measurements are merged with a land model to estimate root-zone (0–100 cm) moisture. The daily image from the 15th of each month is shown. ~9 km resolution: it shows the region, not a single field. The colour scale covers 0 to 0.7 m³/m³ (the share of the soil volume that is water); 0.7 and above is grey."
    },
    source: "NASA SMAP Level 4 (GIBS)"
  },
  {
    id: "rain",
    gibs: "MERRA2_Precipitation_Bias_Corrected_Monthly",
    tms: "GoogleMapsCompatible_Level6",
    maxZoom: 6,
    ext: "png",
    start: "2001-01", end: "2026-08", day: 1,
    color: "linear-gradient(90deg,#f7fcfd,#d6efee,#c3e8e1,#a4dccf,#85cfba,#64c1a2,#4eb587,#3aa66a,#28914d,#147e3a,#00441b)",
    title: { tr: "Yağış", en: "Rain" },
    icon: "rain", tint: "#e2eefa", ink: "#1f5fa0",
    plain: {
      tr: "Yeşil koyulaştıkça o ay daha çok yağmur ya da kar yağmış; beyaza yakın yerlere neredeyse hiç yağmamış. Ayları oynatınca bölgenizde yağmurun hangi mevsimlerde yoğunlaştığını görebilirsiniz.",
      en: "Darker green means more rain or snow that month; nearly white areas had almost none. Play the months to see which seasons bring most of the rain in your area."
    },
    legend: { tr: ["Hiç", "Çok (günde 18 mm ve üstü)"], en: ["None", "A lot (18+ mm a day)"] },
    science: {
      tr: "MERRA-2 yeniden analiz verisindeki aylık yağış, yer ölçümleriyle düzeltilmiş (bias-corrected) hâli. Çözünürlük yaklaşık 50 km. Renk skalası 0 ile 0,00021 kg/m²/s arasını gösterir; bu, günde yaklaşık 18 mm'ye (ayda yaklaşık 540 mm) karşılık gelir.",
      en: "Monthly precipitation from the MERRA-2 reanalysis, bias-corrected with gauge observations. ~50 km resolution. The colour scale covers 0 to 0.00021 kg/m²/s, which corresponds to about 18 mm a day (roughly 540 mm a month)."
    },
    source: "NASA GMAO MERRA-2 (GIBS)"
  },
  {
    id: "temp",
    gibs: "MERRA2_2m_Air_Temperature_Monthly",
    tms: "GoogleMapsCompatible_Level6",
    maxZoom: 6,
    ext: "png",
    start: "2001-01", end: "2026-08", day: 1, skip: ["2023-12", "2024-01", "2024-05"],
    color: "linear-gradient(90deg,#5e4fa2,#5ab4aa,#8ed1a4,#c3e69f,#ebf7a0,#fefdbc,#fee28f,#fdbb6c,#f88a50,#e85b47,#9e0142)",
    title: { tr: "Sıcaklık", en: "Temperature" },
    icon: "temp", tint: "#fbe9e2", ink: "#b2442a",
    plain: {
      tr: "Mavi ve yeşil yerler donma noktasının çok altında. Sarı yerler donma noktası civarında, turuncu yerler ılık, kırmızı yerler sıcak. En sıcak yerler koyu vişne rengi (mora çalan koyu kırmızı) görünür. Yılları oynatınca yazların zamanla daha sıcak geçip geçmediğine bakabilirsiniz. Sıcaklık artarsa bitkiler daha çok su ister.",
      en: "Blue and green are far below freezing. Yellow is around freezing, orange is mild, and red is hot. The hottest places show as a dark wine red that can look purplish. Play the years to check whether summers have been getting hotter. Hotter weather means crops need more water."
    },
    legend: { tr: ["Soğuk (−53°C)", "Sıcak (37°C)"], en: ["Cold (−53°C)", "Hot (37°C)"] },
    science: {
      tr: "Yerden 2 metre yükseklikteki aylık ortalama hava sıcaklığı. MERRA-2, uydu ve yer ölçümlerini bir atmosfer modeliyle birleştiren bir yeniden analiz veri setidir (yaklaşık 50 km çözünürlük). Renk skalası 220 ile 310 kelvin arasını gösterir (yaklaşık −53°C ile 37°C): sarı 0°C civarı, açık turuncu 10°C, turuncu 20°C, kırmızı 30°C civarıdır.",
      en: "Monthly mean air temperature at 2 m. MERRA-2 is a reanalysis that blends satellite and ground observations with an atmospheric model (~50 km resolution). The colour scale covers 220 to 310 kelvin (about −53°C to 37°C): yellow is around 0°C, light orange 10°C, orange 20°C and red around 30°C."
    },
    source: "NASA GMAO MERRA-2 (GIBS)"
  },
  {
    id: "grace",
    gibs: "GRACE_Tellus_Liquid_Water_Equivalent_Thickness_Mascon_CRI",
    tms: "GoogleMapsCompatible_Level6",
    maxZoom: 6,
    ext: "png",
    dates: GRACE_DATES,
    // DİKKAT: bu katmanın renkleri BİLİNÇLİ OLARAK çevrildi (ekip kararı, 14 Kasım 2026).
    // NASA'nın özgün skalasında mavi = normalden az su, kırmızı = normalden fazladır. "flip: true" ile karolar
    // haritada kırmızı–mavi yer değiştirilerek çizilir (js/map.js "flip" bölmesi + index.html'deki SVG süzgeci),
    // böylece diğer katmanlardaki "mavi = ıslak" ile tutarlı olur. Aşağıdaki renk çubuğu da çevrilmiş hâldir.
    flip: true,
    color: "linear-gradient(90deg,#ff3300,#ff5b32,#ff8466,#ffac99,#ffd5cc,#fefbfd,#ccd5ff,#99acff,#6684ff,#325bff,#0033ff)",
    title: { tr: "Yeraltı suyu", en: "Groundwater" },
    icon: "waves", tint: "#e0f2f4", ink: "#1d7f8c",
    plain: {
      tr: "Kırmızı yerlerde toprakta, yeraltında ve göllerde normalden az su var; mavi yerlerde normalden fazla; beyaz yerler normale yakın. Bir bölge yıllar içinde kırmızıya dönüyorsa, kuyulardan çekilen suyun yerine yenisi gelmiyor olabilir.",
      en: "Red means less water than normal in soil, aquifers and lakes; blue means more; white is close to normal. If an area turns redder over the years, water pumped from wells may not be getting replaced."
    },
    legend: { tr: ["Normalden az (−30 cm)", "Normalden fazla (+30 cm)"], en: ["Below normal (−30 cm)", "Above normal (+30 cm)"] },
    science: {
      tr: "GRACE ve GRACE-FO uyduları Dünya'nın çekim alanındaki küçük değişimleri ölçer; bu değişimler büyük ölçüde suyun yer değiştirmesinden kaynaklanır. Değer, 2004–2009 ortalamasına göre fark (cm su eşdeğeri) olarak verilir. Renk skalası −30 cm (kırmızı) ile +30 cm (mavi) arasını gösterir; 0 beyazdır. Renkler, diğer katmanlarla tutarlı ve kolay okunsun diye NASA'nın özgün skalasının tersine çevrildi; veriler aynı. Çözünürlük çok kabadır (yaklaşık 300 km), yalnızca havza ölçeğinde yorumlanmalıdır. 2017-06 ile 2018-05 arasında veri yoktur.",
      en: "GRACE and GRACE-FO measure tiny changes in Earth's gravity, mostly caused by water moving around. Values are anomalies relative to the 2004–2009 mean (cm of equivalent water). The colour scale runs from −30 cm (red) to +30 cm (blue); 0 is white. The colours were reversed from NASA's original scale so that they are easy to read and consistent with the other layers; the data are the same. Resolution is very coarse (~300 km), so read it only at basin scale. No data between 2017-06 and 2018-05."
    },
    source: "NASA JPL GRACE/GRACE-FO Mascon (GIBS)"
  }
];

// Katman ikonları (basit çizgi ikonlar)
const ICONS = {
  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21c0-9 5-15 15-16-1 10-7 15-15 16z"/><path d="M5 21l8-8"/></svg>',
  drop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/></svg>',
  satellite: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M3 6l4 4M17 14l4 4M7 3l3 3M14 17l3 3M18 4a3 3 0 0 1 2 2"/></svg>',
  rain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 15a4 4 0 0 1 0-8 5 5 0 0 1 9.6 1.4A3.5 3.5 0 0 1 17 15H7z"/><path d="M8 18l-1 2M12 18l-1 2M16 18l-1 2"/></svg>',
  temp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z"/><path d="M12 10v6"/></svg>',
  waves: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/></svg>'
};

// Bir katmanın oynatılabilir karelerini üretir: [{ y, m, time }]
function buildFrames(layer) {
  if (layer.dates) {
    return layer.dates.map(d => ({ y: Number(d.slice(0, 4)), m: Number(d.slice(5, 7)), time: d }));
  }
  const [sy, sm] = layer.start.split("-").map(Number);
  const [ey, em] = layer.end.split("-").map(Number);
  const skip = new Set(layer.skip || []);
  const out = [];
  for (let y = sy, m = sm; y < ey || (y === ey && m <= em); ) {
    const ym = `${y}-${String(m).padStart(2, "0")}`;
    if (!skip.has(ym)) out.push({ y, m, time: `${ym}-${String(layer.day).padStart(2, "0")}` });
    m++;
    if (m > 12) { m = 1; y++; }
  }
  return out;
}

function layerYears(layer) {
  const f = buildFrames(layer);
  return `${f[0].y}–${f[f.length - 1].y}`;
}

// ---------- NASA GIBS WMS: tek parça uydu görüntüsü (Hakkımızda, Tarladan kartları, profil kartı) ----------
// 15 Kasım 2026'da GIBS'in GetCapabilities belgesinden doğrulandı: uç nokta, WMS 1.3.0, CRS EPSG:4326
// (BBOX sırası: güney enlem, batı boylam, kuzey enlem, doğu boylam) ve katman adı (MODIS/Terra gerçek renk, günlük).
const GIBS_WMS = "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi";
const GIBS_TRUE_COLOR = "MODIS_Terra_CorrectedReflectance_TrueColor";
function gibsImageUrl(bbox, date, width = 640, height = 360) {
  return `${GIBS_WMS}?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=${GIBS_TRUE_COLOR}&STYLES=&FORMAT=image/jpeg&CRS=EPSG:4326` +
    `&BBOX=${bbox.join(",")}&WIDTH=${width}&HEIGHT=${height}&TIME=${date}`;
}
// GIBS WMS ara sıra görüntü yerine hata belgesi döndürüyor (15 Kasım 2026'da birkaç kez gözlendi). Görüntü
// yüklenmezse iki kez daha denenir; yine olmazsa kutu aynı boyda kalır ve görüntünün alt metni görünür.
function loadGibsImage(img, url, tries = 2) {
  img.onerror = () => {
    if (tries <= 0) { img.onerror = null; return; }
    tries--;
    setTimeout(() => { img.src = `${url}&retry=${2 - tries}`; }, 700);
  };
  img.src = url;
}