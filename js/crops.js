// BU DOSYA OTOMATİK ÜRETİLİR — elle değiştirmeyin.
// Üreten betik: tools/build_crops.py   Ekibin doldurduğu dosya: tools/urunler.json
// Değişiklik için urunler.json'u düzenleyip şu komutu çalıştırın:  python tools/build_crops.py
//
// Kaynak: FAO ECOCROP, Recocrop R paketi üzerinden (inst/parameters/ecocrop.rds); 20 ürün.
// Sayılar tablodan olduğu gibi alınır. Ekip bir sayıyı düzelttiyse (urunler.json "duzeltme"),
// tablodaki değer, yeni değer ve gerekçe o ürünün "corrections" ve "check" alanlarında yazar.
//
// Alanlar:
//   ecocrop                   tablodaki özgün ad, bilimsel ad ve CODE numarası (kaydı tekrar bulmak için)
//   gmin, gmax                yetişme süresi, gün (GMIN, GMAX)
//   ktmp                      öldürücü sıcaklık, °C (KTMP). Tabloda 0 ise muhtemelen varsayılan değerdir;
//                             o zaman ktmp null yazılır ve frostHardy kullanılır.
//   frostHardy                dona dayanıklı mı (true/false), EKİPTEN. ktmp null olan ürünlerde ve kışlık
//                             ekilebilen ürünlerde dolu; kışlık ürünlerde ktmp yazsa bile hesapta bu kullanılır.
//   frostSource               hesapta kullanılan don bilgisinin kaynağı: "ecocrop" (ktmp) ya da "team" (frostHardy)
//   tmin, topmn, topmx, tmax  sıcaklık: dayanma alt sınırı, en iyi aralık, dayanma üst sınırı (°C)
//   rmin, ropmn, ropmx, rmax  YILLIK yağış: alt sınır, en iyi aralık, üst sınır (mm). FAO tanımı yıllıktır.
//   legume                    tablodaki aile adı (FAMNAME) Leguminosae ise true
//   group, name               ECOCROP'tan değil, ekipten (urunler.json)
//   winterCrop                true ise kışlık ekilebilir (EKİPTEN): soğuk ama öldürücü olmayan aylar "kış beklemesi" sayılır
//   longCycle                 true ise ürün tarlada bir yıla yakın ya da daha uzun kalabilir
//   typicalMonths             tarlada kaldığı tipik süre (ay); typicalMonthsApproved false ise ÖNERİ/TASLAKTIR
//   winterMonths              kışlık ekimde tarlada kaldığı süre (ay); yalnızca kışlık ürünlerde, ekipten
//   waterNeed                 FAO sulama el kitabındaki su ihtiyacı (mm, tüm yetişme dönemi); 8 üründe yok (null).
//                             Puana girmez; kartta kanıt olarak gösterilir.
//   rootDepth                 ECOCROP'ta yok; Aşama 4 için ayrıldı, şimdilik boş
//   check                     ekibin notları ve betiğin otomatik uyarıları

const CROP_SOURCE = "FAO ECOCROP (via the Recocrop package)";

const CROPS = [
  {
    "id": "wheat",
    "name": {
      "en": "Wheat",
      "tr": "Buğday"
    },
    "scientific": "Triticum aestivum",
    "family": "Gramineae",
    "group": "cereal",
    "legume": false,
    "ecocrop": {
      "name": "Wheat, common",
      "scientific": "Triticum aestivum L.",
      "code": 8
    },
    "gmin": 90,
    "gmax": 250,
    "ktmp": null,
    "frostHardy": true,
    "frostSource": "team",
    "tmin": 5,
    "topmn": 15,
    "topmx": 23,
    "tmax": 27,
    "rmin": 300,
    "ropmn": 750,
    "ropmx": 900,
    "rmax": 1600,
    "winterCrop": true,
    "longCycle": false,
    "corrections": [],
    "typicalMonths": 5,
    "typicalMonthsApproved": true,
    "winterMonths": 9,
    "waterNeed": {
      "min": 450,
      "max": 650,
      "droughtSensitivity": "low-medium",
      "faoRow": "Barley/Oats/Wheat",
      "source": "FAO Irrigation Water Management Training Manual No. 3 (1986), Table 14"
    },
    "rootDepth": null,
    "check": "KTMP tabloda 0 (muhtemelen varsayılan); dona dayanıklılık bilgisi ECOCROP'tan değil EKİPTEN."
  },
  {
    "id": "barley",
    "name": {
      "en": "Barley",
      "tr": "Arpa"
    },
    "scientific": "Hordeum vulgare",
    "family": "Gramineae",
    "group": "cereal",
    "legume": false,
    "ecocrop": {
      "name": "Barley",
      "scientific": "Hordeum vulgare L.",
      "code": 9
    },
    "gmin": 90,
    "gmax": 240,
    "ktmp": -4,
    "frostHardy": true,
    "frostSource": "team",
    "tmin": 2,
    "topmn": 15,
    "topmx": 20,
    "tmax": 40,
    "rmin": 200,
    "ropmn": 500,
    "ropmx": 1000,
    "rmax": 2000,
    "winterCrop": true,
    "longCycle": false,
    "corrections": [],
    "typicalMonths": 5,
    "typicalMonthsApproved": true,
    "winterMonths": 8,
    "waterNeed": {
      "min": 450,
      "max": 650,
      "droughtSensitivity": "low-medium",
      "faoRow": "Barley/Oats/Wheat",
      "source": "FAO Irrigation Water Management Training Manual No. 3 (1986), Table 14"
    },
    "rootDepth": null,
    "check": "Dayanma üst sınırı 40°C, en iyi aralığın üst ucu 20°C: aradaki fark çok büyük; FAO sitesinden kontrol edilecek. Kışlık ekilebilen ürün: don için ECOCROP'un KTMP değeri (-4°C) yerine EKİBİN dona dayanıklılık bilgisi kullanılıyor."
  },
  {
    "id": "rye",
    "name": {
      "en": "Rye",
      "tr": "Çavdar"
    },
    "scientific": "Secale cereale",
    "family": "Gramineae",
    "group": "cereal",
    "legume": false,
    "ecocrop": {
      "name": "Rye",
      "scientific": "Secale cereale L.",
      "code": 18
    },
    "gmin": 110,
    "gmax": 270,
    "ktmp": null,
    "frostHardy": true,
    "frostSource": "team",
    "tmin": 5,
    "topmn": 15,
    "topmx": 20,
    "tmax": 30,
    "rmin": 400,
    "ropmn": 600,
    "ropmx": 1000,
    "rmax": 2000,
    "winterCrop": true,
    "longCycle": false,
    "corrections": [],
    "typicalMonths": 4,
    "typicalMonthsApproved": true,
    "winterMonths": 10,
    "waterNeed": null,
    "rootDepth": null,
    "check": "KTMP tabloda 0 (muhtemelen varsayılan); dona dayanıklılık bilgisi ECOCROP'tan değil EKİPTEN."
  },
  {
    "id": "maize",
    "name": {
      "en": "Maize (corn)",
      "tr": "Mısır"
    },
    "scientific": "Zea mays",
    "family": "Gramineae",
    "group": "cereal",
    "legume": false,
    "ecocrop": {
      "name": "Maize",
      "scientific": "Zea mays L. s. mays",
      "code": 2
    },
    "gmin": 65,
    "gmax": 365,
    "ktmp": null,
    "frostHardy": false,
    "frostSource": "team",
    "tmin": 10,
    "topmn": 18,
    "topmx": 33,
    "tmax": 47,
    "rmin": 400,
    "ropmn": 600,
    "ropmx": 1200,
    "rmax": 1800,
    "winterCrop": false,
    "longCycle": false,
    "corrections": [],
    "typicalMonths": 5,
    "typicalMonthsApproved": true,
    "winterMonths": null,
    "waterNeed": {
      "min": 500,
      "max": 800,
      "droughtSensitivity": "medium-high",
      "faoRow": "Maize",
      "source": "FAO Irrigation Water Management Training Manual No. 3 (1986), Table 14"
    },
    "rootDepth": null,
    "check": "Tabloda 8 mısır satırı var; genel olan 'Maize' (Zea mays L. s. mays) seçildi. Dayanma üst sınırı 47°C yüksek görünüyor; kontrol edilecek. KTMP tabloda 0 (muhtemelen varsayılan); dona dayanıklılık bilgisi ECOCROP'tan değil EKİPTEN. Yetişme süresi 65–365 gün: çok geniş."
  },
  {
    "id": "sunflower",
    "name": {
      "en": "Sunflower",
      "tr": "Ayçiçeği"
    },
    "scientific": "Helianthus annuus",
    "family": "Compositae",
    "group": "oilseed",
    "legume": false,
    "ecocrop": {
      "name": "Sunflower",
      "scientific": "Helianthus annuus L v macro",
      "code": 46
    },
    "gmin": 70,
    "gmax": 200,
    "ktmp": -10,
    "frostHardy": null,
    "frostSource": "ecocrop",
    "tmin": 5,
    "topmn": 17,
    "topmx": 34,
    "tmax": 45,
    "rmin": 300,
    "ropmn": 600,
    "ropmx": 1000,
    "rmax": 1600,
    "winterCrop": false,
    "longCycle": false,
    "corrections": [],
    "typicalMonths": 4,
    "typicalMonthsApproved": true,
    "winterMonths": null,
    "waterNeed": {
      "min": 600,
      "max": 1000,
      "droughtSensitivity": "low-medium",
      "faoRow": "Sunflower",
      "source": "FAO Irrigation Water Management Training Manual No. 3 (1986), Table 14"
    },
    "rootDepth": null,
    "check": "KTMP -10°C: listedeki en düşük değer, beklenmedik görünüyor; FAO sitesinden kontrol edilecek."
  },
  {
    "id": "sugarbeet",
    "name": {
      "en": "Sugar beet",
      "tr": "Şeker pancarı"
    },
    "scientific": "Beta vulgaris",
    "family": "Chenopodiaceae",
    "group": "root",
    "legume": false,
    "ecocrop": {
      "name": "Sugar beet",
      "scientific": "Beta vulgaris L. v vulgaris",
      "code": 1598
    },
    "gmin": 160,
    "gmax": 200,
    "ktmp": -2,
    "frostHardy": null,
    "frostSource": "ecocrop",
    "tmin": 4,
    "topmn": 15,
    "topmx": 25,
    "tmax": 35,
    "rmin": 500,
    "ropmn": 650,
    "ropmx": 900,
    "rmax": 1200,
    "winterCrop": false,
    "longCycle": false,
    "corrections": [],
    "typicalMonths": 7,
    "typicalMonthsApproved": true,
    "winterMonths": null,
    "waterNeed": {
      "min": 550,
      "max": 750,
      "droughtSensitivity": "low-medium",
      "faoRow": "Sugarbeet",
      "source": "FAO Irrigation Water Management Training Manual No. 3 (1986), Table 14"
    },
    "rootDepth": null,
    "check": "Tabloda 4 Beta vulgaris satırı var; 'Sugar beet' (v vulgaris) seçildi. Diğerleri: Spinach beet, Garden beet, Swiss chard."
  },
  {
    "id": "potato",
    "name": {
      "en": "Potato",
      "tr": "Patates"
    },
    "scientific": "Solanum tuberosum",
    "family": "Solanaceae",
    "group": "root",
    "legume": false,
    "ecocrop": {
      "name": "Potato",
      "scientific": "Solanum tuberosum L.",
      "code": 1
    },
    "gmin": 90,
    "gmax": 160,
    "ktmp": -1,
    "frostHardy": null,
    "frostSource": "ecocrop",
    "tmin": 7,
    "topmn": 15,
    "topmx": 25,
    "tmax": 30,
    "rmin": 250,
    "ropmn": 500,
    "ropmx": 800,
    "rmax": 2000,
    "winterCrop": false,
    "longCycle": false,
    "corrections": [],
    "typicalMonths": 4,
    "typicalMonthsApproved": true,
    "winterMonths": null,
    "waterNeed": {
      "min": 500,
      "max": 700,
      "droughtSensitivity": "high",
      "faoRow": "Potato",
      "source": "FAO Irrigation Water Management Training Manual No. 3 (1986), Table 14"
    },
    "rootDepth": null,
    "check": ""
  },
  {
    "id": "canola",
    "name": {
      "en": "Canola (rapeseed)",
      "tr": "Kanola"
    },
    "scientific": "Brassica napus",
    "family": "Cruciferae",
    "group": "oilseed",
    "legume": false,
    "ecocrop": {
      "name": "Swede rap",
      "scientific": "Brassica napus L.",
      "code": 89
    },
    "gmin": 85,
    "gmax": 340,
    "ktmp": -6,
    "frostHardy": true,
    "frostSource": "team",
    "tmin": 5,
    "topmn": 15,
    "topmx": 25,
    "tmax": 41,
    "rmin": 400,
    "ropmn": 500,
    "ropmx": 1000,
    "rmax": 2800,
    "winterCrop": true,
    "longCycle": false,
    "corrections": [],
    "typicalMonths": 4,
    "typicalMonthsApproved": true,
    "winterMonths": 10,
    "waterNeed": null,
    "rootDepth": null,
    "check": "Tabloda 'Swede rap' adıyla geçiyor. Diğer satır 'Rutabaga' alınmadı. Dayanma üst sınırı 41°C yüksek görünüyor; kontrol edilecek. Kışlık ekilebilen ürün: don için ECOCROP'un KTMP değeri (-6°C) yerine EKİBİN dona dayanıklılık bilgisi kullanılıyor. Yetişme süresi 85–340 gün: çok geniş."
  },
  {
    "id": "chickpea",
    "name": {
      "en": "Chickpea",
      "tr": "Nohut"
    },
    "scientific": "Cicer arietinum",
    "family": "Leguminosae",
    "group": "legume",
    "legume": true,
    "ecocrop": {
      "name": "Chick pea",
      "scientific": "Cicer arietinum L.",
      "code": 52
    },
    "gmin": 90,
    "gmax": 180,
    "ktmp": -9,
    "frostHardy": null,
    "frostSource": "ecocrop",
    "tmin": 7,
    "topmn": 15,
    "topmx": 29,
    "tmax": 35,
    "rmin": 300,
    "ropmn": 600,
    "ropmx": 1000,
    "rmax": 1800,
    "winterCrop": false,
    "longCycle": false,
    "corrections": [],
    "typicalMonths": 4,
    "typicalMonthsApproved": true,
    "winterMonths": null,
    "waterNeed": null,
    "rootDepth": null,
    "check": "KTMP -9°C düşük görünüyor; FAO sitesinden kontrol edilecek."
  },
  {
    "id": "lentil",
    "name": {
      "en": "Lentil",
      "tr": "Mercimek"
    },
    "scientific": "Lens culinaris",
    "family": "Leguminosae",
    "group": "legume",
    "legume": true,
    "ecocrop": {
      "name": "Lentil",
      "scientific": "Lens culinaris Medikus",
      "code": 56
    },
    "gmin": 70,
    "gmax": 240,
    "ktmp": null,
    "frostHardy": true,
    "frostSource": "team",
    "tmin": 5,
    "topmn": 15,
    "topmx": 29,
    "tmax": 32,
    "rmin": 250,
    "ropmn": 600,
    "ropmx": 1000,
    "rmax": 2500,
    "winterCrop": true,
    "longCycle": false,
    "corrections": [],
    "typicalMonths": 5,
    "typicalMonthsApproved": true,
    "winterMonths": 8,
    "waterNeed": null,
    "rootDepth": null,
    "check": "KTMP tabloda 0 (muhtemelen varsayılan); dona dayanıklılık bilgisi ECOCROP'tan değil EKİPTEN."
  },
  {
    "id": "bean",
    "name": {
      "en": "Common bean",
      "tr": "Fasulye"
    },
    "scientific": "Phaseolus vulgaris",
    "family": "Leguminosae",
    "group": "legume",
    "legume": true,
    "ecocrop": {
      "name": "Bean, Common",
      "scientific": "Phaseolus vulgaris L.",
      "code": 61
    },
    "gmin": 50,
    "gmax": 270,
    "ktmp": null,
    "frostHardy": false,
    "frostSource": "team",
    "tmin": 7,
    "topmn": 16,
    "topmx": 25,
    "tmax": 32,
    "rmin": 300,
    "ropmn": 500,
    "ropmx": 2000,
    "rmax": 4300,
    "winterCrop": false,
    "longCycle": false,
    "corrections": [],
    "typicalMonths": 3,
    "typicalMonthsApproved": true,
    "winterMonths": null,
    "waterNeed": {
      "min": 300,
      "max": 500,
      "droughtSensitivity": "medium-high",
      "faoRow": "Bean",
      "source": "FAO Irrigation Water Management Training Manual No. 3 (1986), Table 14"
    },
    "rootDepth": null,
    "check": "KTMP tabloda 0 (muhtemelen varsayılan); dona dayanıklılık bilgisi ECOCROP'tan değil EKİPTEN. Yetişme süresi 50–270 gün: çok geniş."
  },
  {
    "id": "soybean",
    "name": {
      "en": "Soybean",
      "tr": "Soya"
    },
    "scientific": "Glycine max",
    "family": "Leguminosae",
    "group": "legume",
    "legume": true,
    "ecocrop": {
      "name": "Soyabean",
      "scientific": "Glycine max (L.) Merrill",
      "code": 7
    },
    "gmin": 75,
    "gmax": 180,
    "ktmp": null,
    "frostHardy": false,
    "frostSource": "team",
    "tmin": 10,
    "topmn": 20,
    "topmx": 33,
    "tmax": 38,
    "rmin": 450,
    "ropmn": 600,
    "ropmx": 1500,
    "rmax": 1800,
    "winterCrop": false,
    "longCycle": false,
    "corrections": [],
    "typicalMonths": 5,
    "typicalMonthsApproved": true,
    "winterMonths": null,
    "waterNeed": {
      "min": 450,
      "max": 700,
      "droughtSensitivity": "low-medium",
      "faoRow": "Soybean",
      "source": "FAO Irrigation Water Management Training Manual No. 3 (1986), Table 14"
    },
    "rootDepth": null,
    "check": "KTMP tabloda 0 (muhtemelen varsayılan); dona dayanıklılık bilgisi ECOCROP'tan değil EKİPTEN."
  },
  {
    "id": "vetch",
    "name": {
      "en": "Common vetch",
      "tr": "Fiğ"
    },
    "scientific": "Vicia sativa",
    "family": "Leguminosae",
    "group": "legume",
    "legume": true,
    "ecocrop": {
      "name": "Common vetch *",
      "scientific": "Vicia sativa L. s. sativa",
      "code": 768
    },
    "gmin": 80,
    "gmax": 170,
    "ktmp": null,
    "frostHardy": true,
    "frostSource": "team",
    "tmin": 3,
    "topmn": 14,
    "topmx": 23,
    "tmax": 28,
    "rmin": 350,
    "ropmn": 700,
    "ropmx": 900,
    "rmax": 1600,
    "winterCrop": true,
    "longCycle": false,
    "corrections": [],
    "typicalMonths": 4,
    "typicalMonthsApproved": true,
    "winterMonths": 8,
    "waterNeed": null,
    "rootDepth": null,
    "check": "Tabloda 2 satır var; 'Common vetch' (s. sativa) seçildi. Diğeri 'Blackpod vetch' (s. nigra, KTMP -5). Addaki '*' işaretinin anlamı bilinmiyor. KTMP tabloda 0 (muhtemelen varsayılan); dona dayanıklılık bilgisi ECOCROP'tan değil EKİPTEN."
  },
  {
    "id": "cowpea",
    "name": {
      "en": "Cowpea",
      "tr": "Börülce"
    },
    "scientific": "Vigna unguiculata",
    "family": "Leguminosae",
    "group": "legume",
    "legume": true,
    "ecocrop": {
      "name": "Cowpea",
      "scientific": "Vigna unguiculata unguic. L",
      "code": 30
    },
    "gmin": 60,
    "gmax": 240,
    "ktmp": null,
    "frostHardy": false,
    "frostSource": "team",
    "tmin": 10,
    "topmn": 20,
    "topmx": 35,
    "tmax": 40,
    "rmin": 400,
    "ropmn": 600,
    "ropmx": 1500,
    "rmax": 4100,
    "winterCrop": false,
    "longCycle": false,
    "corrections": [],
    "typicalMonths": 3,
    "typicalMonthsApproved": true,
    "winterMonths": null,
    "waterNeed": null,
    "rootDepth": null,
    "check": "Tabloda 3 satır var; 'Cowpea' (unguic.) seçildi. 'Sowpea' satırı tutarsız olduğu için alınmadı; 'Asparagus bean' farklı bir tür. KTMP tabloda 0 (muhtemelen varsayılan); dona dayanıklılık bilgisi ECOCROP'tan değil EKİPTEN. Yetişme süresi 60–240 gün: çok geniş."
  },
  {
    "id": "rice",
    "name": {
      "en": "Rice (paddy)",
      "tr": "Çeltik (sulu pirinç)"
    },
    "scientific": "Oryza sativa",
    "family": "Gramineae",
    "group": "cereal",
    "legume": false,
    "ecocrop": {
      "name": "Rice, paddy (Indica)",
      "scientific": "Oryza sativa L. s. indica",
      "code": 4
    },
    "gmin": 80,
    "gmax": 200,
    "ktmp": null,
    "frostHardy": false,
    "frostSource": "team",
    "tmin": 16,
    "topmn": 25,
    "topmx": 35,
    "tmax": 38,
    "rmin": 1000,
    "ropmn": 1500,
    "ropmx": 2000,
    "rmax": 4000,
    "winterCrop": false,
    "longCycle": false,
    "corrections": [],
    "typicalMonths": 4,
    "typicalMonthsApproved": true,
    "winterMonths": null,
    "waterNeed": {
      "min": 450,
      "max": 700,
      "droughtSensitivity": "high",
      "faoRow": "Rice (paddy)",
      "source": "FAO Irrigation Water Management Training Manual No. 3 (1986), Table 14"
    },
    "rootDepth": null,
    "check": "Tabloda 5 pirinç satırı var; ekip kararıyla su altında yetiştirilen 'Rice, paddy (Indica)' kullanılıyor. KTMP tabloda 0 (muhtemelen varsayılan); dona dayanıklılık bilgisi ECOCROP'tan değil EKİPTEN."
  },
  {
    "id": "sorghum",
    "name": {
      "en": "Sorghum",
      "tr": "Sorgum"
    },
    "scientific": "Sorghum bicolor",
    "family": "Gramineae",
    "group": "cereal",
    "legume": false,
    "ecocrop": {
      "name": "Sorghum (med. altitude)",
      "scientific": "Sorghum bicolor (L.) Moench",
      "code": 1219
    },
    "gmin": 90,
    "gmax": 300,
    "ktmp": null,
    "frostHardy": false,
    "frostSource": "team",
    "tmin": 10,
    "topmn": 24,
    "topmx": 35,
    "tmax": 40,
    "rmin": 300,
    "ropmn": 500,
    "ropmx": 1000,
    "rmax": 3000,
    "winterCrop": false,
    "longCycle": false,
    "corrections": [],
    "typicalMonths": 4,
    "typicalMonthsApproved": true,
    "winterMonths": null,
    "waterNeed": {
      "min": 450,
      "max": 650,
      "droughtSensitivity": "low",
      "faoRow": "Sorghum/Millet",
      "source": "FAO Irrigation Water Management Training Manual No. 3 (1986), Table 14"
    },
    "rootDepth": null,
    "check": "Tabloda rakıma göre 3 satır var. Ekip kararı: 'low altitude' satırının en iyi sıcaklık aralığı (27–35°C) sorgumu serin ve yüksek yerlerde haksız yere uygunsuz gösteriyordu; daha geniş aralığı olan 'med. altitude' seçildi. KTMP tabloda 0 (muhtemelen varsayılan); dona dayanıklılık bilgisi ECOCROP'tan değil EKİPTEN. Yetişme süresi 90–300 gün: çok geniş."
  },
  {
    "id": "pearlmillet",
    "name": {
      "en": "Pearl millet",
      "tr": "İnci darısı"
    },
    "scientific": "Pennisetum glaucum",
    "family": "Gramineae",
    "group": "cereal",
    "legume": false,
    "ecocrop": {
      "name": "Pearl millet",
      "scientific": "Pennisetum glaucum (L)R.Br.",
      "code": 195
    },
    "gmin": 60,
    "gmax": 120,
    "ktmp": 2,
    "frostHardy": null,
    "frostSource": "ecocrop",
    "tmin": 12,
    "topmn": 25,
    "topmx": 35,
    "tmax": 40,
    "rmin": 200,
    "ropmn": 400,
    "ropmx": 900,
    "rmax": 1700,
    "winterCrop": false,
    "longCycle": false,
    "corrections": [],
    "typicalMonths": 4,
    "typicalMonthsApproved": true,
    "winterMonths": null,
    "waterNeed": {
      "min": 450,
      "max": 650,
      "droughtSensitivity": "low",
      "faoRow": "Sorghum/Millet",
      "source": "FAO Irrigation Water Management Training Manual No. 3 (1986), Table 14"
    },
    "rootDepth": null,
    "check": ""
  },
  {
    "id": "cassava",
    "name": {
      "en": "Cassava",
      "tr": "Manyok"
    },
    "scientific": "Manihot esculenta",
    "family": "Euphorbiaceae",
    "group": "root",
    "legume": false,
    "ecocrop": {
      "name": "Cassava",
      "scientific": "Manihot esculenta Crantz.",
      "code": 5
    },
    "gmin": 180,
    "gmax": 365,
    "ktmp": 7,
    "frostHardy": null,
    "frostSource": "ecocrop",
    "tmin": 10,
    "topmn": 20,
    "topmx": 29,
    "tmax": 35,
    "rmin": 500,
    "ropmn": 1000,
    "ropmx": 1500,
    "rmax": 5000,
    "winterCrop": false,
    "longCycle": true,
    "corrections": [],
    "typicalMonths": 12,
    "typicalMonthsApproved": true,
    "winterMonths": null,
    "waterNeed": null,
    "rootDepth": null,
    "check": "Yetişme süresi 180–365 gün; 365 tablonun üst sınırı, yani ürün tarlada bir yıldan uzun kalıyor olabilir. Rotasyon girişi 12 aydan uzun bir dönemi anlatamaz (ekim ve hasat yalnızca ay olarak giriliyor). Ekip kararıyla listede tutuluyor. Yetişme süresi 180–365 gün: çok geniş."
  },
  {
    "id": "sweetpotato",
    "name": {
      "en": "Sweet potato",
      "tr": "Tatlı patates"
    },
    "scientific": "Ipomoea batatas",
    "family": "Convolvulaceae",
    "group": "root",
    "legume": false,
    "ecocrop": {
      "name": "Sweet potato",
      "scientific": "Ipomoea batatas (L.) Lam.",
      "code": 22
    },
    "gmin": 80,
    "gmax": 170,
    "ktmp": 1,
    "frostHardy": null,
    "frostSource": "ecocrop",
    "tmin": 10,
    "topmn": 18,
    "topmx": 28,
    "tmax": 38,
    "rmin": 500,
    "ropmn": 750,
    "ropmx": 1250,
    "rmax": 5000,
    "winterCrop": false,
    "longCycle": false,
    "corrections": [],
    "typicalMonths": 4,
    "typicalMonthsApproved": true,
    "winterMonths": null,
    "waterNeed": null,
    "rootDepth": null,
    "check": ""
  },
  {
    "id": "groundnut",
    "name": {
      "en": "Groundnut (peanut)",
      "tr": "Yer fıstığı"
    },
    "scientific": "Arachis hypogaea",
    "family": "Leguminosae",
    "group": "legume",
    "legume": true,
    "ecocrop": {
      "name": "Groundnut",
      "scientific": "Arachis hypogaea L.",
      "code": 24
    },
    "gmin": 90,
    "gmax": 150,
    "ktmp": null,
    "frostHardy": false,
    "frostSource": "team",
    "tmin": 10,
    "topmn": 22,
    "topmx": 32,
    "tmax": 45,
    "rmin": 400,
    "ropmn": 600,
    "ropmx": 1500,
    "rmax": 4000,
    "winterCrop": false,
    "longCycle": false,
    "corrections": [],
    "typicalMonths": 5,
    "typicalMonthsApproved": true,
    "winterMonths": null,
    "waterNeed": {
      "min": 500,
      "max": 700,
      "droughtSensitivity": "low-medium",
      "faoRow": "Peanut",
      "source": "FAO Irrigation Water Management Training Manual No. 3 (1986), Table 14"
    },
    "rootDepth": null,
    "check": "Dayanma üst sınırı 45°C yüksek görünüyor; kontrol edilecek. KTMP tabloda 0 (muhtemelen varsayılan); dona dayanıklılık bilgisi ECOCROP'tan değil EKİPTEN."
  }
];
