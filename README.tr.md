# DECO — NASA Space Apps 2026 · Field Shift challenge

**NASA verisiyle ekim nöbeti kararları.** (DECO: ürün rotasyonu kararı için DEcision + CrOp.)

*(English, for the jury: [README.md](README.md). Bu dosya ekibin Türkçe çalışma notudur.)*

**Yayın adresi:** https://aleyna-dogan6d.github.io/DECO/
**Depo:** https://github.com/aleyna-dogan6d/DECO

NASA uydu verisiyle dünyanın her yerindeki çiftçilere ekim nöbeti (rotasyon) önerileri sunan web uygulaması.
Kod MIT lisansıyla yayımlanır ([LICENSE](LICENSE)); lisans yalnızca kodu kapsar, veriler kendi sağlayıcılarının
koşullarıyla kullanılır. Kaynakların tam listesi README.md'nin "Sources and attributions" bölümündedir.
Bu sürümde dört aşama var: (1) dünya haritası, NASA katmanları, geçmişi oynatan zaman çizelgesi ve seçilen nokta için
iklim özeti; (2) tarla planı formu ve tarla takvimi; (3) mevcut rotasyon + en fazla üç alternatifin kural tabanlı karşılaştırması;
(4) "İklim değişirse ne olur?" kaydırıcıları (aynı kartların kaydırılmış iklimle yeniden puanlanması).

## Nasıl çalıştırılır

**En kolayı:** `index.html` dosyasına çift tıklayın. Site tarayıcıda açılır (internet bağlantısı gerekir).

**VS Code ile (önerilen):**
1. Klasörü VS Code'da açın: *File → Open Folder → field-shift*.
2. Eklentilerden **Live Server**'ı kurun.
3. `index.html` dosyasına sağ tıklayıp **Open with Live Server** deyin.
   Dosyayı kaydettiğiniz anda sayfa kendiliğinden yenilenir.

"Konumumu kullan" düğmesi tarayıcı kuralları gereği yalnızca `https://` adreslerde ya da
Live Server gibi `localhost` üzerinde çalışır; dosyaya çift tıklayarak açınca çalışmayabilir.

## Klasör yapısı

```
index.html        tek sayfa: harita, paneller, zaman çizelgesi
css/style.css     görünüm (açık tema, mobil uyum)
js/i18n.js        Türkçe / İngilizce metinler
js/layers.js      NASA katmanları: ad, tarih aralığı, halk dili açıklamaları
js/map.js         Leaflet haritası, katman geçişleri, tarla işareti
js/field.js       seçilen tarla: iklim özeti (NASA POWER), grafik, yer arama
js/crops.js       ürün verisi: 20 tek yıllık ürün, FAO ECOCROP değerleri (Recocrop paketi üzerinden)
js/calendar.js    tarla takvimi: tipik bir yılın 12 aylık yağış, sıcaklık ve don özeti
js/rotation.js    rotasyon karşılaştırması: takvim, altı ölçüt (1–5), alternatif üretimi; kural tabanlıdır
js/future.js      "gelecek iklim" kaydırıcıları: iklimi kaydırır (sıcaklık, yağış, FAO-56 Hargreaves ile buharlaşma düzeltmesi); yeni bir bitki modeli değildir
js/cards.js       rotasyon kartları: mevcut rotasyon + en fazla üç alternatif; kanıt, bilgi boşluğu ve risk cümleleri; kaydırıcılarla yeniden puanlama; "Bu seçeneği incele" paneli (puanların gerçek sayılarla açıklaması, geçiş takvimi, yardım kutusu)
js/pages.js       sayfalar ve menü (#home, #plan, #farmers, #about, #profile), ana sayfa hikâyesi ve animasyonlar (GSAP)
js/plan.js        tarla planı ekranı: mevcut rotasyon (ekim dönemleri), toprak, su, eğim, öncelikler; yanıtlar cihazda saklanır; "5 dakikalık tarla testi" (FieldCheck: toprak dokusu ve eğim cevabı formu doldurur, drenaj ve geçen yıl yalnızca kaydedilir; puanlama kuralı eklemez; yöntem: FAO / USDA NRCS "soil texture by feel", metinler ve cm eşikleri ekipten)
js/profile.js     tarla profili PROTOTİPİ (#profile): kayıtlı tarla ve rotasyon, "Bu yıl için önerimiz" kartı, aylık tarla notu; "Örnek profili aç" düğmesi (hazır örnek: Konya, buğday + nadas, "Örnek" etiketli üç not); hesap/şifre/e-posta yok, veriler yalnızca tarayıcıda (localStorage "deco-profile")
js/app.js         uygulama akışı: karşılama, katmanlar, oynatma, dil
```

## Kullanılan NASA verileri

| Katman | GIBS kimliği | Dönem |
| --- | --- | --- |
| Bitki örtüsü (NDVI) | `MODIS_Terra_L3_NDVI_Monthly` | 2001–2026 |
| Toprak nemi (25 yıl) | `GLDAS_Underground_Soil_Moisture_Monthly` | 2001–2026 |
| Kök bölgesi nemi | `SMAP_L4_Analyzed_Root_Zone_Soil_Moisture` | 2015–2026 |
| Yağış | `MERRA2_Precipitation_Bias_Corrected_Monthly` | 2001–2026 |
| Hava sıcaklığı | `MERRA2_2m_Air_Temperature_Monthly` | 2001–2026 |
| Yeraltı ve yüzey suyu | `GRACE_Tellus_Liquid_Water_Equivalent_Thickness_Mascon_CRI` | 2002–2022 |

Tarla kartı: NASA POWER API, seçilen nokta için aylık `T2M` (sıcaklık), `T2M_MIN` (ayın en düşük
sıcaklığı, don riski için) ve `PRECTOTCORR` (yağış), 2001–2024. Bir ay, yılların en az %20'sinde
0°C altına düştüyse "don riski var" sayılır.

Yer arama ve yer adları: OpenStreetMap Nominatim (saniyede en fazla 1 istek kuralı var; arama
kutusu yazmayı bitirince 0,45 sn bekleyerek istek atar).

Katman adları ve tarih aralıkları 14 Kasım 2026'da GIBS kataloğundan kontrol edildi:
https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/1.0.0/WMTSCapabilities.xml

## Ürün eklemek ya da değiştirmek

`js/crops.js` elle yazılmaz; bir betik onu FAO ECOCROP tablosundan üretir.

1. `tools/urunler.json` dosyasını açın. Yeni ürün için bir satır ekleyin: kısa ad (`id`), ECOCROP `CODE` numarası,
   bilimsel ad, TR/EN ad, grup ve (gerekiyorsa) dona dayanıklılık. Sıcaklık, yağış gibi sayılar buraya yazılmaz.
2. Doğru `CODE` numarasını bulmak için `field-shift` klasöründe: `python tools/build_crops.py --ara "Zea mays"`
3. Aynı klasörde `python tools/build_crops.py` komutunu çalıştırın. `js/crops.js` baştan yazılır; betik seçilen
   satırları ve tutarsız ya da eksik kayıtları ekrana listeler.

Bir sayıyı elle düzeltmek gerekirse (ör. FAO sitesinde farklı yazıyorsa) `urunler.json`'da o ürünün `duzeltme`
alanını doldurun: `"duzeltme": { "KTMP": { "deger": -3, "gerekce": "FAO sayfasında -3 yazıyor" } }`. Gerekçe zorunludur;
tablodaki değer, yeni değer ve gerekçe `js/crops.js`'teki nota yazılır.

ECOCROP tablosu (`tools/ecocrop.rds`) depoda ve yayımlanan sitede yer almaz (`.gitignore`'da): tablo betik
tarafından indirilir. Betik, dosya yoksa onu ilk çalıştırmada Recocrop R paketinin GitHub deposundan kendisi indirir.
Kaynak gösterimi: FAO ECOCROP (Recocrop paketi üzerinden). Altlık harita, sınırlar ve yer adları NASA GIBS'ten gelir
(© OpenStreetMap katkıda bulunanlar).

## Yeni katman eklemek

`js/layers.js` içindeki `LAYERS` listesine bir nesne ekleyin. GIBS kimliğini, karo setini
(`GoogleMapsCompatible_LevelN`), tarih aralığını ve Türkçe/İngilizce açıklamaları doldurun.
Gösterge renklerini ve açıklamadaki renk adlarını katmanın resmi renk skalası dosyasından alın: katalogda o katmanın
`ows:Metadata` satırındaki `colormaps/v1.3/...xml` adresi. Renkleri tahminle yazmayın.

## Bilinen sınırlar

- Gösterge renkleri GIBS'in resmi renk skalası dosyalarından (`colormaps/v1.3`) örneklenmiş 11 renktir; ara tonlar yaklaşıktır.
  Uç etiketleri skalanın uçlarıdır, o günkü haritanın en düşük ve en yüksek değeri değildir.
- Yeraltı suyu katmanında renkler bilinçli olarak çevrilmiştir: sitede kırmızı "normalden az su", mavi "normalden fazla su"
  demektir. NASA'nın özgün skalası (ve NASA Worldview) bunun tersidir. Veriler aynıdır; yalnızca kırmızı ile mavi yer
  değiştirir (`index.html`'deki `swapRedBlue` süzgeci, `js/layers.js`'te `flip: true`).
- Kışlık ekilebilen ürünlerde (buğday, arpa, çavdar, kanola, fiğ, mercimek) don için ECOCROP'taki öldürücü sıcaklık değil,
  ekibin "dona dayanıklı" bilgisi kullanılır: kışlık tahıllar sonbaharda soğuğa alışarak daha düşük sıcaklıklara dayanabilir;
  ECOCROP'taki tek değer bunu yansıtmıyor olabilir. Çok sert kışlarda ürün yine donabilir; model bunu göstermez.
- Kışlık ürünler ilkbaharda soğuğa dayanıklılığını kaybeder; geç bahar donları gerçek bir risktir ama model bunu göstermez.
- GLDAS ve SMAP L4 model destekli ürünlerdir, doğrudan ölçüm değildir.
- GRACE çok kaba çözünürlüklüdür (yaklaşık 300 km) ve 2017-06 ile 2018-05 arasında veri yoktur.
- Uydu verileri tek bir tarlayı değil, bölgeyi gösterir. NASA POWER yaklaşık 50 km'lik hücrelerle çalışır.
- Tarla takvimi 2001–2024 ortalamalarını gösterir; tek bir yıl ortalamadan çok farklı geçebilir.
- "Ürüne göre aylar" eğilim gösteren basitleştirilmiş bir modeldir: çeşit farklarını, toprağı ve sulama zamanını bilmez.
  Bazı ürünlerde dona dayanıklılık ve "kışlık ekilebilir" bilgisi ECOCROP'tan değil ekipten gelir.
- Rotasyon girişinde ekim ve hasat yalnızca ay olarak girilir; 12 aydan uzun bir dönem (ör. manyok) anlatılamaz.
- Rotasyon seçenekleri kural tabanlı bir karşılaştırmadır; tahmin ya da yapay zeka değildir. Su puanı yıllık yağışa bakar,
  yağışın mevsimini hesaba katmaz. Model nadasın toprakta su biriktirmesini, anız örtüsünü, fiyatları ve verimi bilmez.
- Ürünlerin tarlada kalma süreleri 13 üründe FAO sulama el kitabından (ekip onaylı), 7 üründe ve kışlık ekim sürelerinde
  ekip bilgisidir; ekip bunları ayrıca bir tarım kaynağından kontrol edecek.
- Kuru tarımda, ürün tarladayken düşen yağış ürünün en az yıllık ihtiyacının üçte birinden azsa o ürün alternatif olarak
  önerilmez. Eşik ekibin seçimidir ve bilinçli olarak gevşek tutulmuştur: kışı yağışlı iklimlerde ilkbaharda ekilen ürünler
  kışın toprakta biriken suyu da kullanır, model ise toprakta biriken suyu hesaplamaz.
- Kuru tarımda, ürünün tarladaki ilk iki ayında 30 mm'den az yağış düşüyorsa ürün alternatif olarak önerilmez.
  Kışlık ekim yalnızca o yerin en soğuk ayından 2 ila 4 ay önce başlayabilir (hemen önceki ay hariç); en soğuk ayı 15°C'nin üstünde olan
  yerde kış yok sayılır. Bu eşikler de ekibin seçimidir ve yalnızca altı yerde denenmiştir.
- Stratejiler iki alternatif üretemezse eksik kartın yerinde "Neden üç kart yok?" açıklaması çıkar ve "Başka fikirler" bölümü açık başlar (eski "Başka bir olasılık" kartları kaldırıldı).
- ECOCROP çeşit farkını bilmez; örneğin serin yaylalarda yerel mısır çeşitleri "sınırda" görünebilir.
- Aynı aile kuralı kabadır: su altında yetişen çeltik ile kuru tarlada yetişen buğdayın hastalık ve zararlıları çoğunlukla
  farklıdır, ama kural ikisini aynı aileden sayar.
- Model ekim ve büyüme aylarını ayırt etmez; yalnızca hasat ayı iklim uyumu puanında sayılmaz.
- Kurak bölgelerde nadas toprakta su biriktirir; model bunu hesaplamaz, yalnızca risk cümlesiyle hatırlatır.
- "İklim değişirse ne olur?" kaydırıcıları bir tahmin ya da iklim projeksiyonu değildir: aynı kurallar, 12 aya eşit
  eklenen sıcaklık ve aynı yüzdeyle değiştirilen yağışla yeniden çalıştırılır. Isınmanın suya etkisi FAO-56 Hargreaves
  denklemiyle (yıllık referans buharlaşmanın artış oranı; NASA POWER `T2M_RANGE` ve `TOA_SW_DWN`) kabaca hesaba katılır.
  Sıcak dalgaları, kurak yıllar, karbondioksitin bitkiye etkisi ve sulama suyunun azalması yoktur. Kartlardaki rotasyonlar
  bugünün iklimine göre seçilir ve sabit kalır. Soğuk ya da serin yerlerde ısınma puanı yükseltebilir; bu, kuralların
  sonucudur, "ısınma iyidir" demek değildir.
- Kartlardaki toprak yönleri (erozyon riski, azot, organik madde) miktar değil yöndür ve kaydırıcılardan etkilenmez.
- Site dört sayfadır: Ana sayfa, Tarlamı planla (uygulama), Tarladan (çiftçi yorumları; henüz yorum yok, uydurma yorum da
  yok; yorum formu henüz açılmadı), Hakkımızda. Ana sayfa, Tarladan ve Hakkımızda sayfalarındaki kaydırma animasyonları GSAP ile yapılır (CDN'den yüklenir;
  kendi "ücretsiz" lisansı vardır, açık kaynak değildir). Yüklenemezse ya da tarayıcıda "hareketi azalt" açıksa site
  animasyonsuz çalışır. Harita ve plan sayfasında animasyon kütüphanesi kullanılmaz.
- Kartların altındaki "Başka fikirler" bölümü çiftçinin rotasyonundan bağımsız, iki ürünlü en çok üç rotasyon gösterir; bu
  ürünlerin bölgede gerçekten yetiştirilip yetiştirilmediği bilinmez (kartta yazıyor).
- Rotasyon kartlarında yedek "Başka bir olasılık" kartları yoktur; yalnızca strateji sonuçları (en çok 3) gösterilir. Ana
  kart sayısı 3'ün altındaysa "Başka fikirler" bölümü açık başlar. Çiftçinin kendi kartında, aynı ürünlerle (aynı sürelerle)
  daha yüksek puanlı bir sıra ya da ekim ayı varsa tek satırla yazılır (ekim ayı en fazla 2 ay kaydırılır).
- Listede olmayan ürün "Diğer" olarak girilebilir; verisi olmadığı için o ürünün iklim ve su puanı hesaplanmaz.
- FAO Crop Calendar yalnızca ürün sürelerinin kontrolünde kullanıldı: Türkiye'yi kapsamıyor; yalnızca Jamaika'da patates ve
  tatlı patates doğrulanabildi.
- Arayüz tarayıcı diline göre Türkçe ya da İngilizce açılır, dil seçicisinden değiştirilebilir; yeni dil `js/i18n.js` içine eklenebilir.

## Yapay zeka kullanımı

Kod ve belgeleri yazarken yapay zeka yardımcılarından (Anthropic'in Claude'u) yararlandık; bütün tasarım kararlarını,
veri seçimlerini ve kontrolleri ekip yaptı ve gözden geçirdi. (İngilizcesi README.md'nin "Use of AI" bölümünde.)

- **Sitede çalışan bir yapay zeka modeli yok;** bütün puanlar açık kurallardan gelir.
- **Kod:** yapay zeka yardımıyla yazıldı (Anthropic Claude, Claude Code üzerinden); DECO ekibi gözden geçirdi ve düzenledi.
  Her kod dosyası bir "AI disclosure" yorum satırıyla başlar; `index.html` içinde `ai-disclosure` meta etiketi vardır.
- **Veri:** ürün tablosu (`js/crops.js`), FAO ECOCROP'tan (Recocrop) `tools/build_crops.py` ile üretilir; bu betik yapay
  zeka yardımıyla yazıldı. Bazı ürün bilgileri ekipten gelir (yukarıda "Ürün eklemek ya da değiştirmek" ve "Bilinen
  sınırlar" bölümlerinde yazıyor).
- **Metin:** belgeler, site metinleri ve sunum metinleri yapay zeka yardımıyla taslak olarak yazıldı ve ekipçe düzenlendi.
- **Görseller:** yapay zeka görsel üreticisi kullanılmadı. Harita ve uydu görüntüleri NASA GIBS'ten gelir. DECO yaprak
  logosu ve küçük arayüz simgeleri, kodda yapay zeka yardımıyla çizilmiş basit SVG'lerdir.

## Ekip

Team Amerikan Okeyi: Aleyna Doğan, Begüm Aksoy, Boran Yılmaz, Burçe Arı, Can Barış Kınal, Ela Demirbilek

NASA Space Apps Challenge 2026 · Field Shift challenge.
