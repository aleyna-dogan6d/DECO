// AI disclosure: written with AI assistance (Anthropic Claude, via Claude Code); reviewed and edited by the DECO team.
// Arayüz metinleri. Yeni dil eklemek için bu nesneye aynı anahtarlarla bir blok ekleyin
// ve index.html'deki dil seçicisine bir <option> koyun.
const I18N = {
  tr: {
    searchPlaceholder: "Köy, ilçe ya da şehir arayın",
    locate: "Konumumu kullan",
    pickOnMap: "Haritadan seçeceğim",
    layersTitle: "Haritada göster",
    moreLayers: "Daha fazla katman",
    lessLayers: "Daha az göster",
    scienceDetail: "Bilimsel detay",
    source: "Veri",
    hintTitle: "Tarlanız nerede?",
    hintText: "Haritada tarlanızın olduğu yere dokunun, yukarıdan bir yer arayın ya da konumunuzu kullanın.",
    yourField: "Seçtiğiniz yer",
    selectedPoint: "Seçilen nokta",
    factRain: "Yıllık yağış",
    factHot: "En sıcak ay",
    factFrost: "Don riski",
    noFrost: "Yok",
    tabRain: "Yağış",
    tabTemp: "Sıcaklık",
    chartNote: "2001–2024 yılları, NASA POWER",
    chartRain: "Yıllık yağış (mm)",
    chartTemp: "Yıllık ortalama sıcaklık (°C)",
    createRotation: "Bu tarla için plan oluştur",
    play: "Geçmişi oynat",
    pause: "Durdur",
    speed: "Hız",
    loadingClimate: "NASA'dan bu yerin 24 yıllık iklim verisi getiriliyor…",
    climateError: "İklim verisi şu an yüklenemedi. İnternet bağlantınızı kontrol edip tekrar deneyin.",
    locating: "Konumunuz bulunuyor…",
    locateError: "Konumunuz alınamadı. Haritadan seçebilir ya da yer arayabilirsiniz.",
    noResults: "Sonuç bulunamadı",
    tileError: "Bu tarih için görüntü yok, bir sonraki tarihe geçin.",
    // ---------- Sayfalar: menü, ana sayfa, çiftçiler, hakkımızda (js/pages.js) ----------
    brandSub: "NASA verisiyle ekim nöbeti kararları",
    navHome: "Ana sayfa",
    navPlan: "Tarlamı planla",
    navFarmers: "Tarladan",
    farmersKicker: "Çiftçi yorumları",
    soonBadge: "Yakında",
    farmersWrite: "Yorum yaz →",
    navAbout: "Hakkımızda",
    // ---------- Tarla profili (PROTOTİP; js/profile.js). "Daha doğru tahmin" gibi bir iddia YAZILMAZ. ----------
    navProfile: "Profilim",
    profileKicker: "Prototip",
    profileTitle: "Tarla profilim",
    profileWarn: "Prototip: veriler yalnızca bu tarayıcıda saklanır. Gelecekte çiftçi notları kuralların iyileştirilmesinde kullanılacak.",
    profile: {
      intro: "Tarlanızı ve rotasyonunuzu bu tarayıcıda saklayın, her ay kısa bir tarla notu yazın. Hesap, şifre ya da e-posta istemiyoruz.",
      // Örnek profil: veriler örnektir, gerçek bir çiftçiye ait değildir; sayfada açıkça yazılır
      demoBtn: "Örnek profili aç",
      demoHint: "Tek tıkla hazır bir örnek yüklenir: Konya, buğday + nadas, örnek tarla notları. Şifre ya da hesap gerekmez.",
      demoTitle: "Örnek profil: kayıtlı tarla",
      demoNotice: "Bu bir örnek profildir. Tarla, yanıtlar ve notlar örnektir; gerçek bir çiftçiye ait değildir. Kendi profilinizi oluşturmak için önce bu örneği silin (sayfanın altında).",
      demoBadge: "Örnek",
      demoNotes: [
        "Örnek not: Yağmurdan sonra toprak nemli; buğday çıkmaya başladı.",
        "Örnek not: Buğday ekildi. Toprak kuru; yağmur bekliyoruz.",
        "Örnek not: Ekim hazırlığı. Toprak kuru ve sert."
      ],
      needTitle: "Profil oluşturmak için önce tarlanızı seçin ve rotasyonunuzu girin.",
      field: "Tarla",
      answers: "Toprak, su ve eğim yanıtları",
      missing: "henüz yok",
      goPlan: "Tarlamı planla →",
      createTitle: "Profil oluştur",
      createLead: "Plan ekranında seçtiğiniz tarla ve girdiğiniz rotasyon kaydedilecek:",
      nameLabel: "Adınız (isteğe bağlı)",
      namePlaceholder: "Örneğin: Ayşe",
      noAccount: "Şifre ve e-posta istenmez. Yanıtlarınız ve profiliniz hiçbir sunucuya gönderilmez. Veri almak için yalnızca seçilen noktanın koordinatı (ve yer aramasında yazdığınız ad) NASA POWER'a, NASA GIBS'e ve OpenStreetMap Nominatim'e gönderilir.",
      createBtn: "Profili oluştur",
      noStore: "Bu tarayıcı kayıt yapmaya izin vermiyor (örneğin gizli sekme). Profil yalnızca bu sayfa açıkken durur.",
      savedTitle: "Kayıtlı tarla",
      savedTitleName: n => `${n}: kayıtlı tarla`,
      created: d => `Profil ${d} tarihinde bu tarayıcıda oluşturuldu.`,
      // Gösterge panelindeki istatistik kutuları
      // "Kayıtlı tarla" kartındaki uydu görüntüsü (NASA GIBS WMS; sabit tarih: js/profile.js, PROFILE_SAT_DATE)
      satAlt: "Kayıtlı noktanın çevresinin uydu görüntüsü (yüklenemedi)",
      satCaption: d => `Görüntü: NASA GIBS / MODIS_Terra_CorrectedReflectance_TrueColor, ${d} (sabit tarih; o gün bölgeniz bulutlu olabilir). Ortadaki işaret kayıtlı noktadır; görüntü yaklaşık 118 km × 66 km'lik bir alanı gösterir, tek bir tarlayı değil.`,
      statCurrent: "Mevcut rotasyon: kural tabanlı puan",
      statBest: "Önerilen rotasyon: kural tabanlı puan",
      statSame: "mevcut rotasyonunuz",
      statNotes: "Kayıtlı not",
      statLast: "Son not",
      adviceTitle: "Bu yıl için önerimiz",
      adviceKeep: s => `Kayıtlı tarlanız için kural tabanlı karşılaştırmayı yeniden çalıştırdık. Bulduğumuz seçenekler arasında en yüksek puanlı olan, şu anki rotasyonunuz (${s} / 5).`,
      adviceOnly: s => `Kayıtlı tarlanız için kural tabanlı karşılaştırmayı yeniden çalıştırdık. Kurallarımız rotasyonunuz için bir alternatif üretmedi; rotasyonunuzun puanı ${s} / 5.`,
      adviceChange: (b, c) => `Kayıtlı tarlanız için kural tabanlı karşılaştırmayı yeniden çalıştırdık. En yüksek puanlı seçenek aşağıda (${b} / 5); şu anki rotasyonunuzun puanı ${c} / 5.`,
      adviceNote: "Bu bir tahmin değildir. Hesap 2001–2024 iklim ortalamalarına dayanır; bu yılın havasını bilmez. Karar vermeden önce yerel bir tarım uzmanına danışın.",
      adviceMore: "Bütün seçenekleri ve ayrıntıları görmek için: Tarlamı planla →",
      retry: "Yeniden dene",
      noteTitle: "Aylık tarla notu",
      noteLead: "Ayda bir, tarlanızda gördüğünüzü kısaca yazın. Notlar şimdilik yalnızca sizin içindir; hesaba girmez.",
      noteDate: "Tarih",
      noteMoisture: "Toprak elinize nasıl geliyor?",
      moisture: { dry: "Kuru", normal: "Normal", wet: "Islak" },
      noteText: "Not (isteğe bağlı)",
      notePlaceholder: "Örneğin: buğday çıktı, tarlanın alt yanında su birikti.",
      noteError: "Tarihi seçin (bugün ya da daha önce) ve toprağın durumunu işaretleyin.",
      noteSave: "Notu kaydet",
      notesTitle: n => `Notlarım (${n})`,
      notesEmpty: "Henüz not yok.",
      noteDelete: "Sil",
      deleteTitle: "Profili sil",
      deleteBtn: "Profili sil",
      deleteConfirm: "Profil ve bütün notlar bu tarayıcıdan silinecek. Geri alınamaz. Emin misiniz?",
      deleteYes: "Evet, sil",
      deleteNo: "Vazgeç"
    },
    homeTitle: "Rotasyonunuz, alternatiflerle yan yana.",
    homeLead: "Dünyanın neresinde olursa olsun tarlanızı seçin. NASA'nın 25 yıllık verisinin bölgeniz için ne dediğini görün, sonra rotasyonunuzu ve alternatiflerini karşılaştırın.",
    homeCta: "Tarlamı planla →",
    storyNdviTitle: "Uydular 25 yıldır tarlalarınızı izliyor.",
    storyNdviText: "Arazinin ne kadar yeşil olduğu, ay ay, 2001'den beri. Görüntü tek bir tarlayı değil, bölgenizi gösterir.",
    storySoilTitle: "NASA, toprağın ne kadar ıslak olduğunu 2001'den beri ay ay hesaplıyor.",
    storySoilText: "Bu, model destekli bir üründür (GLDAS); doğrudan ölçüm değildir.",
    storyThirdTitle: "Sıcaklık, ay ay, 2001'den beri.",
    storyThirdText: "NASA'nın MERRA-2 kaydından. Kendi tarlanızın puanları için bölgenizin NASA POWER verisini kullanıyoruz.",
    homeCompareTitle: "Bu verilerle rotasyonunuzu en fazla üç alternatifle karşılaştırıyoruz.",
    homeCompareText: "Her seçenekte nedeni, dayandığı veri, bilmediklerimiz ve riskleri yazar.",
    homeCompareYani: "Yani: kararı siz ve yerel tarım uzmanınız verirsiniz. Bu, kural tabanlı bir karşılaştırmadır; tahmin değildir.",
    homeStep1: "Tarlanızı bulun",
    homeStep1Text: "Arayın, haritaya dokunun ya da konumunuzu kullanın.",
    homeStep2: "Geçmişi oynatın",
    homeStep2Text: "Altı NASA katmanı, 2001'den 2026'ya.",
    homeStep3: "Tarlanızı anlatın",
    homeStep3Text: "Ürünler, toprak, su, öncelikler.",
    homeStep4: "Karşılaştırın, sonra iklimi deneyin",
    homeStep4Text: "Rotasyonunuz ve alternatifleri; daha sıcak ve daha kurak iklim kaydırıcıları.",
    homeNumLayers: "NASA harita katmanı",
    homeNumYears: "yıllık iklim kaydı",
    homeNumCrops: "ürün",
    homeNumZero: "hesap, izleyici ya da yapay zeka modeli",
    homeEndTitle: "Kendi tarlanız için görün.",
    homeEndNote: "Veri: NASA GIBS, NASA POWER, FAO ECOCROP, © OpenStreetMap katkıda bulunanlar. Uydu verisi tek bir tarlayı değil, tarlanın bulunduğu bölgeyi gösterir.",
    farmersTitle: "Bu bölgedeki çiftçiler ne diyor?",
    farmersLead: "Çiftçiler kendi tarlalarında neyin işe yaradığını paylaşabilecek. Yorumlar bölgeye göre ve çiftçinin kendi sözleriyle gösterilecek.",
    farmersEmpty: "Henüz yorum yok. İlk yorumu siz yazın.",
    farmersFormSoon: "Yorum formu yakında açılacak. Bağlantı gelene kadar bu düğme çalışmaz ve hiçbir şey göndermez.",
    farmersRulesTitle: "Yorumlar nasıl işleyecek",
    farmersRule1: "Çiftçilerin adına yorum yazmıyoruz. Yukarıdaki örnek kartlar açıkça \"örnek\" diye işaretlidir; gerçek yorum değildir.",
    // ÖRNEK yorumlar (ekip kararı, 15 Kasım 2026): üstteki not ve karttaki etiket arayüz metnidir (TR/EN). Kartların başlığı ve
    // metni iki dilde de İngilizce gösterilir; onlar js/pages.js içindeki FARMER_EXAMPLES listesindedir.
    farmersExampleNote: "Henüz gerçek çiftçi yorumu yok. Aşağıdakiler bu bölümün nasıl görüneceğini gösteren örneklerdir.",
    farmersExampleLabel: "Örnek yorum (test için) — gerçek bir çiftçiye ait değil",
    // Örnek kartların üstündeki NASA GIBS görüntüleri (bölge adları kart sırasıyla; tarihler js/pages.js, FARMER_EXAMPLES)
    farmersImageRegions: ["Konya ovası", "Ludhiana çevresi (Pencap)", "Jamaika"],
    farmersImageAlt: r => `${r}: uydu görüntüsü (yüklenemedi)`,
    farmersImageSource: "Görüntüler: NASA GIBS / MODIS_Terra_CorrectedReflectance_TrueColor (MODIS Terra gerçek renk). Konya ovası: 20 Temmuz 2026; Ludhiana çevresi (Pencap): 12 Mart 2025; Jamaika: 19 Şubat 2026. Görüntüler yalnızca bölgeyi gösterir; bir çiftçinin tarlasını değil.",
    farmersRule2: "Kimlik doğrulanmaz. Yorum bir çiftçinin kişisel deneyimidir; öneri değildir. Sizin tarlanız farklı olabilir.",
    farmersRule3: "Yalnızca ad ve ilçe gösterilir; soyad, telefon, e-posta ya da tarlanın konumu hiçbir zaman gösterilmez.",
    farmersRule4: "Yorumlar yazıldıkları dilde gösterilir.",
    farmersLink: "Bu bölgedeki çiftçiler ne diyor? →",
    farmersLinkSoon: "Henüz yorum yok; yorum formu yakında açılacak.",
    aboutKicker: "NASA Space Apps Challenge 2026 · Field Shift challenge",
    aboutTitle: "DECO hakkında",
    aboutLead: "DECO: ürün rotasyonu kararı için DEcision + CrOp. Çiftçinin bugün uyguladığı rotasyonu, bölgesinin NASA verisini kullanarak en fazla üç alternatifle karşılaştırmasına yardım eder.",
    // Hakkımızda'daki NASA GIBS görüntüsü (WMS; katman ve tarih 15 Kasım 2026'da kaynağından doğrulandı). NASA logosu yok; "NASA onaylı" izlenimi veren ifade yazılmaz.
    aboutImageCap: "Görüntü: NASA GIBS / MODIS_Terra_CorrectedReflectance_TrueColor (MODIS Terra gerçek renk), 20 Temmuz 2026. Konya ovası, Türkiye: yeşil lekeler temmuzda bitkilerin yeşil olduğu yerlerdir; üstteki beyaz alan Tuz Gölü'dür.",
    aboutImageAlt: "Konya ovasının uydu görüntüsü (yüklenemedi)",
    aboutHowTitle: "Nasıl kullanılır",
    aboutHow1: "Tarlanızı seçin: \"Tarlamı planla\" sayfasında yer arayın, \"Konumumu kullan\"a basın ya da haritaya tıklayın.",
    aboutHow2: "Geçmişe bakın: bir NASA katmanı seçip \"Geçmişi oynat\"a basın. Tarla kartında bölgenizin 2001–2024 yağış ve sıcaklık özeti görünür.",
    aboutHow3: "Tarlanızı anlatın: \"Bu tarla için plan oluştur\"a basın; mevcut rotasyonunuzu (ürün, ekim ayı, hasat ayı), toprağı, su durumunu, eğimi, önceliklerinizi ve kolay sattığınız ürünleri girin.",
    aboutHow4: "Rotasyonları karşılaştırın: kendi rotasyonunuz, en fazla üç alternatifle yan yana gelir. \"Bu seçeneği incele\" ile puanların nasıl çıktığını ve geçiş takvimini görün.",
    aboutHow5: "\"İklim değişirse ne olur?\" kaydırıcılarını oynatın; isterseniz \"Profilim\" sayfasında tarlanızı kaydedip aylık not tutun. Karar vermeden önce yerel bir tarım uzmanına danışın.",
    aboutFutureTitle: "Gelecek planları",
    aboutFutureLead: "Aşağıdakiler plandır; hiçbiri henüz yapılmadı.",
    aboutFuture1: "Gerçek hesaplar: profilin başka cihazlardan da açılabilmesi (şimdilik profil, yalnızca tarayıcıda duran bir prototip).",
    aboutFuture2: "Çiftçilerin notları ve yorumlarıyla kuralların iyileştirilmesi.",
    aboutFuture3: "Eğitim modülleri: ekim nöbeti ve toprak sağlığı üzerine kısa, sade anlatımlar.",
    aboutFuture4: "Eğimin SRTM'den, toprak tipinin SoilGrids'ten otomatik alınması (bu iki kaynağı henüz denemedik).",
    aboutFuture5: "Daha fazla ürün.",
    aboutFuture6: "Kısa vadeli hava tahminiyle ekim zamanı uyarıları (Meteomatics).",
    aboutFuture7: "Kendi alan adımız.",
    aboutTeamTitle: "Ekip",
    aboutTeam: "DECO Team",
    aboutChallengeTitle: "Challenge",
    aboutChallenge: "Challenge, çiftçinin şu an uyguladığı rotasyon dahil en az üç ekim nöbetini karşılaştıran ve her biri için neden önerildiğini, dayandığı veriyi, faydalarını, bilinmeyenleri ve riskleri gösteren bir araç istiyor.",
    aboutMethodTitle: "Nasıl çalışıyor, dürüstçe",
    aboutMethod1: "Karşılaştırma kural tabanlıdır. Yapay zeka, tahmin ya da bitki büyüme modeli değildir.",
    aboutMethod2: "İklim NASA POWER'dan (2001–2024 aylık ortalamaları), ürünlerin ihtiyaçları FAO ECOCROP'tan gelir.",
    aboutMethod3: "Her rotasyon 1 ile 5 arasında altı puan alır: iklim uyumu, su, azot, toprak örtüsü, zararlı döngüsü ve satılabilirlik. Ağırlıkları sizin öncelikleriniz belirler.",
    aboutMethod4: "Alternatifler rotasyonunuzda tek bir şeyi değiştirir: boş bir dönemi doldurur ya da bir ürünü değiştirir.",
    aboutMethod5: "Bazı eşikleri ekip seçti ve yalnızca altı yerde denendi. Site bunları böyle işaretler.",
    aboutMethod6: "Uydu ve iklim verisi tek bir tarlayı değil, tarlanın bulunduğu bölgeyi anlatır. Ekim planınızı değiştirmeden önce yerel bir tarım uzmanına danışın.",
    aboutSourcesTitle: "Kaynaklar",
    aboutSourcesLead: "Yalnızca sitenin gerçekten kullandığı kaynaklar listelenir.",
    aboutLicenceTitle: "Lisans",
    aboutLicence: "Kodumuz MIT lisansıyla yayımlanır. Lisans yalnızca kodu kapsar; veriler ve kütüphaneler kendi koşullarıyla kullanılır.",
    pg: {
      exHead: "Örnek: Konya, kuru tarım",
      exYour: "Sizin rotasyonunuz",
      exYourNote: "Kural tabanlı karşılaştırma puanı",
      exSoil: "Toprak sağlığı seçeneği",
      exSoilNote: "azot kazandırır, toprak daha az çıplak kalır",
      exWater: "Su tasarruflu seçenek",
      exWaterNote: "buranın yağışına daha yakın bir ürün"
    },
    // ---------- Aşama 3: forma eklenen sorular ----------
    otherOption: "Diğer (listede yok)",
    otherNameLabel: "Ürünün adı",
    otherNamePlaceholder: "ör. susam",
    otherDefault: "Diğer ürün",
    otherCalNote: n => `${n} için verimiz yok; aylara göre uygunluk gösterilemiyor.`,
    fallowOption: "Nadas (boş yıl)",
    fallowShort: "Nadas",
    fallowNote: "Tarla 12 ay boş kalır; ekim ve hasat ayı sorulmaz.",
    qSell: "Bölgenizde kolayca satabildiğiniz ürünler hangileri?",
    sellHelp: "İstediğiniz kadar seçin. Para hesabı yapmıyoruz.",
    sellNone: "seçilmedi",
    optionsTitle: "Rotasyon seçenekleri",
    optionsLead: "Sizin rotasyonunuz ve basit kurallarla üretilen en fazla üç alternatif. Puanlar bir tahmin değil, kural tabanlı bir karşılaştırmadır.",
    // ---------- Aşama 4: "gelecek iklim" kaydırıcı kutusunun sabit metinleri ----------
    futureTitle: "İklim değişirse ne olur?",
    futureDisclaimer: "Bu bir tahmin değil; iklim değişirse kurallarımıza göre ne olacağını gösteren bir karşılaştırma.",
    futureTempLabel: "Sıcaklık",
    futureRainLabel: "Yağış",
    futureReset: "Bugüne dön",
    // ---------- Aşama 3: kart metinleri. Risk ve bilgi boşluğu cümleleri ekipçe onaylandı (14 Kasım 2026). ----------
    s3: {
      // ---------- Aşama 4 metinleri ----------
      tempVal: v => (v ? `+${v}°C` : "bugünkü gibi"),
      rainVal: v => (v ? `${v > 0 ? "+" : "−"}%${Math.abs(v)}` : "bugünkü gibi"),
      tempShort: v => (v ? `+${v}°C` : "sıcaklık bugünkü gibi"),
      rainShort: v => (v ? `yağış ${v > 0 ? "+" : "−"}%${Math.abs(v)}` : "yağış bugünkü gibi"),
      futureSticky: (a, b) => `Seçilen iklim: ${a}, ${b} · değiştir`,
      futureIdle: "Kaydırıcıları oynatın; kartlardaki puanlar ve riskler yeniden hesaplanır.",
      futureScenario: (dT, dP) => {
        const parts = [];
        if (dT) parts.push(`${dT}°C daha sıcak`);
        if (dP) parts.push(`%${Math.abs(dP)} daha ${dP > 0 ? "çok" : "az"} yağışlı`);
        return `${parts.join(" ve ")} bir iklimde`;
      },
      futureYani: (scenario, text) => `Yani: ${scenario} ${text}`,
      futureNoChange: "Yani: bu aralıkta kurallarımıza göre puanlar değişmiyor.",
      futureCrit: (name, up, down) => {
        const parts = [];
        if (up) parts.push(`${up} kartta yükseliyor`);
        if (down) parts.push(`${down} kartta düşüyor`);
        return `"${name}" puanı ${parts.join(", ")}.`;
      },
      futureTopSame: n => `En yüksek toplam puan yine: ${n}.`,
      futureTopNew: (n, o) => `En yüksek toplam puan artık: ${n} (bugün: ${o}).`,
      futureCold: "Kurallarımıza göre burada ısınma kış aylarını ürünler için daha uygun yapıyor; aşırı sıcak ve kuraklık bu karşılaştırmada yok.",
      futureCool: "Kurallarımıza göre burada ısınma serin ayları ürünler için daha uygun yapıyor; aşırı sıcak ve kuraklık bu karşılaştırmada yok.",
      futureTied: " (eşit puanla)",
      futureLessRain: names => `Burada yağış ${names} için ideal miktarın üstündeydi; azalması kurallarımıza göre onu ideale yaklaştırıyor.`,
      riskEtNote: "(seçilen iklimde, buharlaşma düşülmüş)",
      futureWarn: "Daha sıcak havada bitkiler ve toprak daha çok su kaybeder. Bunu FAO'nun basit bir yöntemiyle kabaca hesaba kattık; sıcak dalgaları ve kurak yıllar bu karşılaştırmada yok.",
      futureAltShown: n => `Bu iklimde kurallarımızın öne çıkardığı alternatif değişiyor: ${n} (aşağıdaki kartlardan biri).`,
      futureAltOther: n => `Bu iklimde kurallarımız başka bir alternatifi öne çıkarırdı: ${n}. Kartlar bugünün iklimine göre seçildi ve sabit tutuldu.`,
      futureNew: "yeni",
      futureMark: v => `Bugünkü puan: ${v}`,
      evFuture: (r, today, et) => `Seçilen iklimde hesapta kullanılan yıllık yağış: yaklaşık ${r} mm (bugün ${today} mm)` + (et ? "; artan buharlaşma kabaca düşülmüştür." : "."),
      blockSoil: "Yıllar içinde toprağa etkisinin yönü",
      soil: {
        dir: {
          erosion: {
            down: "Erozyon riski: sizin rotasyonunuza göre azalma eğiliminde (yağmurun daha azı çıplak toprağa düşüyor).",
            up: "Erozyon riski: sizin rotasyonunuza göre artma eğiliminde (yağmurun daha çoğu çıplak toprağa düşüyor).",
            same: "Erozyon riski: sizin rotasyonunuza benzer."
          },
          nitrogen: {
            up: "Topraktaki azot: sizin rotasyonunuza göre artma eğiliminde (baklagil payı daha yüksek).",
            down: "Topraktaki azot: sizin rotasyonunuza göre azalma eğiliminde (baklagil payı daha düşük).",
            same: "Topraktaki azot: sizin rotasyonunuza benzer."
          },
          organic: {
            up: "Organik madde: sizin rotasyonunuza göre artma eğiliminde (tarla daha çok ay ürünle örtülü).",
            down: "Organik madde: sizin rotasyonunuza göre azalma eğiliminde (tarla daha az ay ürünle örtülü).",
            same: "Organik madde: sizin rotasyonunuza benzer."
          }
        },
        level: {
          erosion: {
            low: "Erozyon riski: düşük tarafta (toprak örtüsü puanına göre).",
            mid: "Erozyon riski: orta düzeyde (toprak örtüsü puanına göre).",
            high: "Erozyon riski: yüksek tarafta (toprak örtüsü puanına göre)."
          },
          nitrogen: {
            none: "Topraktaki azot: rotasyonda baklagil yok; ürünler toprağa azot kazandırmıyor.",
            some: "Topraktaki azot: rotasyondaki baklagiller toprağa azot kazandırıyor."
          },
          organic: (occ, months) => `Organik madde: tarla ${months} ayın ${occ} ayında ürünle örtülü. Örtülü ay arttıkça organik madde artma eğilimindedir.`
        },
        note: "Bu yönler rotasyonlar arasındaki farkı gösterir; iklim kaydırıcılarından etkilenmez. Miktar hesaplanmaz."
      },
      futureScience: (et0, pct, dT) => "Bu yeni bir bitki modeli değildir: yukarıdaki kural tabanlı karşılaştırma, kaydırılmış iklimle yeniden çalıştırılır. Sıcaklık kaydırıcısı 12 ayın ortalama ve en düşük sıcaklıklarına aynı dereceyi ekler; yağış kaydırıcısı 12 ayın yağışını aynı yüzdeyle değiştirir. Gerçek iklim değişikliği aylara eşit dağılmaz; bu yüzden bu bir iklim projeksiyonu değildir. " +
        (et0 === null
          ? "Bu yer için buharlaşma hesabının verisi eksik; ısınmanın suya etkisi hesaba katılamadı. "
          : `Isınmanın suya etkisi: referans buharlaşma FAO-56'daki Hargreaves denklemiyle (denklem 52) hesaplanır; günlük sıcaklık farkı (T2M_RANGE) ve dünya dışı radyasyon (TOA_SW_DWN) NASA POWER'dan gelir ve değişmediği varsayılır. Ortalaması −17,8°C'nin altındaki aylarda buharlaşma sıfır sayılır. Bu yerde bugünkü yıllık referans buharlaşma yaklaşık ${et0} mm. ` +
            (pct === null ? "" : `+${dT}°C'de yaklaşık %${pct} artar. `) +
            "Sıcaklık kaydırıcısı sıfırdan farklıyken her ayın yağışı yıllık buharlaşmanın artış oranına bölünür (\"etkili yağış\"). Bu kaba bir düzeltmedir: sıcak dalgalarını, kurak yılları, havadaki karbondioksitin bitkiye etkisini ve sulama suyunun azalmasını içermez. ") +
        "Kartlardaki rotasyonlar bugünün iklimine göre seçilir ve sabit kalır. Toprak yönleri: erozyon riski, yağmurun çıplak toprağa düşen payına bakar (alternatifte pay en az 10 puan farklıysa yön değişir; 10 puan ekibin seçimidir); azot, baklagil payına; organik madde, tarlanın ürünle örtülü olduğu ayların payına bakar (FAO Koruyucu Tarım'ın \"toprağı örtülü tutma\" ilkesi). Bunlar miktar değil yöndür.",
      strategy: { current: "Sizin rotasyonunuz", soil: "Toprak sağlığı", water: "Su tasarruflu", market: "Pazar odaklı", other: "Başka bir olasılık" },
      strong: "Rotasyonunuz bu karşılaştırmada zaten güçlü görünüyor.",
      neutral: "Stratejilerimiz belirgin bir iyileştirme bulamadı; karşılaştırma için başka fikirler aşağıda.",
      whyOther: "Stratejilerimiz rotasyonunuzu iyileştiren iki seçenek bulamadı. Bu, tek değişiklikle elde edilen rotasyonlar arasında toplam puanı en yüksek olanlardan biri.",
      versusOtherLower: "Bu seçenek karşılaştırma için; genel puanı sizin rotasyonunuzdan düşük.",
      riskSowing: (n, mm) => `${n} ekildiği ilk iki ayda buraya yalnızca yaklaşık ${mm} mm yağış düşüyor. Sulama olmadan çıkış ve ilk gelişme zorlanabilir.`,
      criteria: { climate: "İklim uyumu", water: "Su", nitrogen: "Azot katkısı", cover: "Toprak örtüsü", pest: "Zararlı döngüsü", sell: "Satılabilirlik" },
      scoreLabel: "Kural tabanlı karşılaştırma puanı",
      how: "Nasıl hesaplandı?",
      howText: {
        climate: "Ürünlerin tarlada olduğu aylar o ürünlere ne kadar uygun. Uygun ay tam, sınırda ay yarım sayılır; uygun olmayan ay sayılmaz. Kış beklemesi ayları ve hasat ayı hesaba girmez.",
        water: "Buranın yıllık yağışı her ürünün istediği yağış aralığının neresinde. Sulama varsa az yağış daha az puan kırar.",
        nitrogen: "Ürünlerin ne kadarı baklagil. Baklagiller toprağa azot kazandırır.",
        cover: "Yağmurun ne kadarı çıplak toprağa düşüyor. Ne kadar azsa puan o kadar yüksek. Dik tarlada puan 1 düşer, düz tarlada 1 artar.",
        pest: "Art arda gelen ürünlerin kaçı farklı aileden. Nadas yılı da döngüyü kırar. Rotasyonda üçten az farklı ürün varsa puan en çok 4 olur.",
        sell: "Ürünlerin kaçı kolay sattığınızı söylediğiniz ürünler arasında."
      },
      howWeights: (w, s, i, noSell) => `Toplam puan bu altı puanın ağırlıklı ortalamasıdır. İklim uyumu her zaman 3 ağırlıkla sayılır. Su puanı "su tasarrufu" kaydırıcınız kadar (${w}), toprakla ilgili üç puanın (azot, toprak örtüsü, zararlı döngüsü) ortalaması "toprak sağlığı" kaydırıcınız kadar (${s}) ağırlık alır.` +
        (noSell ? " Kolay sattığınız ürünleri seçmediğiniz için satılabilirlik toplama girmedi." : ` Satılabilirlik "ek gelir" kaydırıcınız kadar (${i}) ağırlık alır.`),
      one: {
        current: "Bu, sizin girdiğiniz rotasyon. Diğer seçenekler bununla karşılaştırılır.",
        soil: { fill: n => `Ürünsüz dönemde ${n} ekerek toprağa azot kazandırır ve toprağı daha az çıplak bırakır.`, swap: (n, o) => `${o} yerine baklagil olan ${n}: toprağa azot kazandırır.` },
        water: { swap: (n, o) => `${o} yerine ${n}: buranın yağışına daha yakın bir ürün.`, fill: n => `${n}: buranın yağışına uygun bir ürün.` },
        market: { fill: n => `Ürünsüz dönemde, kolay sattığınız ${n} ekilir.`, swap: (n, o) => `${o} yerine kolay sattığınız ${n}.` },
        other: { fill: n => `Ürünsüz dönemde ${n} ekilir.`, swap: (n, o) => `${o} yerine ${n}.` }
      },
      why: {
        soil: n => `${n} bir baklagil; rotasyonunuzdaki baklagil payını artırıyor.`,
        water: (n, o) => `${n}, ${o} ürününe göre daha az yağışla yetinebiliyor.`,
        market: n => `${n}, kolay sattığınızı söylediğiniz ürünlerden.`
      },
      versusLine: (up, name, a, b) => `${up ? "↑ Daha iyi" : "↓ Daha kötü"}: ${name} (${a} → ${b})`,
      versusSame: "Puanlar sizin rotasyonunuza yakın.",
      versusLower: name => `${name} açısından daha iyi; genel puanı sizin rotasyonunuzdan düşük.`,
      blockWhy: "Neden bu seçenek?",
      blockVersus: "Sizinkine göre",
      blockEvidence: "Kanıt",
      blockGaps: "Bilgi boşlukları",
      blockRisks: "Riskler",
      none: "Kurallarımız bir şey bulmadı.",
      evRain: r => `Buraya yılda yaklaşık ${r} mm yağış düşüyor (NASA POWER, 2001–2024 ortalaması).`,
      evBare: p => `Yağmurun yaklaşık %${p} kadarı toprak ürünsüzken düşüyor (NASA POWER aylık yağışı).`,
      evInField: (n, mm) => `${n} tarladayken buraya yaklaşık ${mm} mm yağış düşüyor (NASA POWER).`,
      evCrop: (n, a, b, c) => `${n}: en az ${a} mm, ideal ${b}–${c} mm yıllık yağış ister (FAO ECOCROP).`,
      evWater: (n, a, b) => `${n} bir yetişme döneminde yaklaşık ${a}–${b} mm su kullanır (FAO sulama el kitabı, 1986).`,
      gapDuration: n => `${n}: tarlada kalma süresi taslak değer, ekip onayı bekliyor. Önerilen ekim ve hasat ayları değişebilir.`,
      // ---------- "Başka fikirler": çiftçinin rotasyonundan bağımsız iki ürünlü rotasyonlar ----------
      // ---------- Çiftçinin kendi kartındaki satır: aynı ürünlerle daha yüksek puanlı düzen ----------
      reorderBest: "Ürünleriniz için düzeniniz kurallarımıza göre zaten en iyi görünüyor.",
      reorderBetter: (changes, a, b) => `Aynı ürünlerle şu değişiklik puanı artırıyor: ${changes} (${a} → ${b}).`,
      reorderSow: (name, from, toIn, harvest) => `${name}: ${from} yerine ${toIn} ekin (hasat: ${harvest})`,
      reorderOrder: seq => `sırayı şöyle yapın: ${seq}`,
      monthsIn: ["Ocak'ta", "Şubat'ta", "Mart'ta", "Nisan'da", "Mayıs'ta", "Haziran'da", "Temmuz'da", "Ağustos'ta", "Eylül'de", "Ekim'de", "Kasım'da", "Aralık'ta"],
      // ---------- "Bu seçeneği incele" paneli (js/cards.js, Cards.detail). Yalnızca motorun hesapladığı sayılar yazılır. ----------
      inspect: "Bu seçeneği incele",
      inspectClose: "İncelemeyi kapat",
      detail: {
        title: n => `İnceleme: ${n}`,
        future: (a, b) => `Bu sayılar seçtiğiniz iklim içindir (${a}, ${b}). Bugünün sayıları için yukarıdaki "Bugüne dön" düğmesine basın.`,
        sciTitle: "Puanlar nasıl çıktı?",
        sciLead: "Her ölçüt için puan, kural ve kullanılan veri. Yalnızca hesapladığımız sayılar yazılır; verim, gübre ya da tohum miktarı hesaplamıyoruz.",
        climateCrop: (n, span, months, st, o1, o2, t1, t2) => `${n} (${span}): tarladaki ${months} ay (hasat ayı dahil): ${st.good} uygun, ${st.edge} sınırda, ${st.wait} kış beklemesi, ${st.bad} uygun değil. FAO ECOCROP: en iyi ${o1}–${o2}°C, dayanabildiği ${t1}–${t2}°C.`,
        climateSum: (g, e, b, n, s) => `Puana giren ${n} ay (hasat ayları ve kış beklemesi sayılmaz): ${g} uygun, ${e} sınırda, ${b} uygun değil. Puan = 1 + 4 × (${g} + ${e} ÷ 2) ÷ ${n} = ${s}.`,
        climateNone: "Puana giren ay yok (yalnızca hasat ayı ya da kış beklemesi); puan 3 sayılır.",
        climateData: "Veri: aylık ortalama sıcaklık ve don ayları, NASA POWER 2001–2024.",
        waterRain: r => `Buranın yıllık yağışı: ${r} mm (NASA POWER, 2001–2024 ortalaması).`,
        waterRainFuture: (r, today) => `Seçilen iklimde hesapta kullanılan yıllık yağış: ${r} mm (bugün ${today} mm).`,
        waterCrop: (n, min, o1, o2, max, s, span, inField, start) => `${n}: FAO ECOCROP yıllık yağış aralığı en az ${min}, ideal ${o1}–${o2}, en çok ${max} mm; bu ürünün su puanı ${s}. Tarladayken (${span}) düşen yağış ${inField} mm; ilk iki ayda ${start} mm.`,
        waterMode: {
          rainfed: "Sulama yok: puan yalnızca yağışa göre.",
          limited: "Kısıtlı sulama: yağış idealin altındaysa, puanın 5'e olan farkının üçte biri puana eklenir.",
          irrigated: "Sulama var: yağış idealin altındaysa, puanın 5'e olan farkının yarısı puana eklenir."
        },
        waterAvg: s => `Su puanı ürünlerin ortalamasıdır: ${s}.`,
        nitrogen: (n, k, names, pct, s) => (k ? `${n} ürünün ${k} tanesi baklagil (${names}); pay %${pct}; puan ${s}.` : `${n} ürünün hiçbiri baklagil değil; puan ${s}.`),
        nitrogenNote: "Kural: baklagil yoksa 1; payı üçte birin altındaysa 3; yarının altındaysa 4; yarı ya da fazlaysa 5. Bağlanan azot miktarı hesaplanmaz. Listede olmayan (\"Diğer\") ürün baklagil sayılmaz.",
        cover: (pct, base) => `Döngüdeki yağışın %${pct} kadarı toprak ürünsüzken düşüyor; bu payın puanı ${base} (en çok %15: 5; %30: 4; %50: 3; %70: 2; daha fazlası: 1).`,
        coverSlope: { flat: "Tarla düz: puana 1 eklenir (en çok 5).", gentle: "Eğim hafif: değişiklik yok.", steep: "Tarla dik: puandan 1 düşülür (en az 1)." },
        coverScore: s => `Toprak örtüsü puanı: ${s}.`,
        coverData: "Veri: aylık yağış, NASA POWER 2001–2024. Nadas ve ürünsüz aylar çıplak toprak sayılır.",
        pest: (n, same) => `Art arda gelen ${n} geçişin ${same} tanesi aynı aileden.`,
        pestFamilies: f => `Aileler (FAO ECOCROP): ${f}.`,
        pestFallow: "Nadas yılı farklı bir ürün gibi sayılır.",
        pestDistinct: n => `Farklı ürün sayısı: ${n}. Üçten azsa puan en çok 4 olur.`,
        pestScore: s => `Zararlı döngüsü puanı: ${s}.`,
        sell: (n, k, names, s) => `${n} ürünün ${k} tanesi kolay sattıklarınız arasında${k ? ` (${names})` : ""}. Puan = 1 + 4 × ${k} ÷ ${n} = ${s}.`,
        sellNoKnown: "Rotasyonda listemizden ürün olmadığı için hesaplanmadı.",
        total: (terms, weights, s) => `Toplam = (${terms}) ÷ (${weights}) = ${s}.`,
        totalSoil: (a, b, c, s) => `"Toprak sağlığı" ağırlığıyla çarpılan sayı, üç toprak puanının ortalamasıdır: (${a} + ${b} + ${c}) ÷ 3 = ${s}.`,
        totalRound: "Sayılar bir ondalığa yuvarlanmış gösterilir; elle hesapta küçük fark çıkabilir.",
        calTitle: "Geçiş takvimi",
        calOwn: "Bu, sizin şu anki rotasyonunuz. Ekim ve hasat ayları yıl yıl şöyle:",
        calFrom: cur => `Şu anki rotasyonunuz: ${cur}. Bu seçeneğe geçerseniz ekim ve hasat ayları yıl yıl şöyle olur:`,
        calWhen: (y, m) => `${y}. yıl, ${m}`,
        calRange: (y1, m1, y2, m2) => `${y1}. yıl ${m1} – ${y2}. yıl ${m2}`,
        calSow: n => `${n} ekimi`,
        calHarvest: n => `${n} hasadı`,
        calFallow: "Nadas (tarla boş)",
        tagNew: "yeni",
        tagSame: "aynı",
        calRepeat: (years, bare, months) => `Sonra döngü baştan başlar (${years} yılda bir). Bu ${months} ayın ${bare} ayında tarlada ürün yok.`,
        calGone: names => `Şu anki rotasyonunuzdan çıkan: ${names}.`,
        calStart: "Takvim yalnızca ayları gösterir. Geçişe hangi yıl başlayacağınıza ve ilk yıl ne yapacağınıza yerel danışmanınızla karar verin.",
        helpTitle: "Yardım mı lazım?",
        helpAdviser: "Yerel tarım danışmanınıza sorun: çeşit seçimi, tohum miktarı, toprak analizi.",
        profileBtn: "Daha fazla bilgi için tarla profili oluşturun",
        profileNote: "Prototip: veriler yalnızca bu tarayıcıda saklanır."
      },
      ideasSummary: n => `Başka fikirler (${n})`,
      ideasTitle: "Bölgeniz için başka rotasyon fikirleri",
      ideasLead: "Bu rotasyonlar sizin ektiklerinizden bağımsız; bölgenizin iklimine göre kurallarımızın öne çıkardığı fikirler.",
      ideasUnknown: "Bu ürünlerin bölgenizde gerçekten yetiştirilip yetiştirilmediğini bilmiyoruz; yerel bir uzmana sorun.",
      ideasNone: "Kurallarımız bu yanıtlarla başka bir fikir üretemedi.",
      ideaKicker: n => `Fikir ${n}`,
      ideaOneNew: names => `Sizin rotasyonunuzda olmayan ürünler: ${names}.`,
      ideaOneSame: "Sizin ürünlerinizle kurulan farklı bir rotasyon.",
      gapOther: n => `${n} için verimiz yok; iklim ve su değerlendirmesi yapılamadı.`,
      gapSoil: "Toprak tipinizi bilmiyoruz; toprağa bağlı riskleri değerlendiremedik.",
      gapSell: "Kolay sattığınız ürünleri seçmediniz; satılabilirlik puanı hesaplanmadı.",
      gapEcocrop: n => `${n}: FAO ECOCROP'taki bazı değerler henüz doğrulanmadı.`,
      gapFrost: n => `${n}: dona dayanıklılık bilgisi ECOCROP'tan değil proje ekibinden geliyor.`,
      gapWater: n => `${n}: FAO tablosunda su ihtiyacı değeri yok.`,
      riskNew: n => `${n} sizin rotasyonunuzda yoktu. Önce küçük bir parselde deneyin.`,
      riskRain: (n, r, min, water) => `${n}: buranın yağışı (${r} mm) bu ürünün en az ihtiyacının (${min} mm) altında. ` + (water === "limited" ? "Kısıtlı sulama açığı kapatmayabilir." : "Sulama olmadan yetmeyebilir."),
      riskMonths: (n, k) => `${n}: hasat ayı dışında, tarlada olduğu aylardan ${k} tanesi bu ürün için uygun değil görünüyor.`,
      riskFamily: (a, b) => (a === b ? `${a} art arda ekiliyor; hastalık ve zararlılar birikebilir.` : `${a} ve ${b} aynı aileden ve art arda geliyor; hastalık ve zararlılar birikebilir.`),
      riskBare: k => `Toprak art arda ${k} ay ürünsüz kalıyor. Bu dönem için örtü bitkisi düşünün.`,
      riskSteep: p => `Tarlanız dik ve yağmurun yaklaşık %${p} kadarı çıplak toprağa düşüyor; toprak kaybı riski yüksek.`,
      riskSandy: "Kumlu toprak suyu az tutar; sulama olmadan kuraklık riski genellikle daha yüksektir.",
      riskClay: "Killi toprak ağırdır ve işlemesi zordur; yağışlı dönemde ekim gecikebilir.",
      riskFallowWater: "Kurak bölgelerde nadas, sonraki ürün için toprakta su biriktirir. Nadası bir ürünle değiştirmek sonraki ürünün suyunu azaltabilir.",
      riskSeason: (n, mm, min) => `${n} tarladayken buraya yalnızca yaklaşık ${mm} mm yağış düşüyor; bu, ürünün en az yıllık ihtiyacının (${min} mm) üçte birinden az. Sulama olmadan bu ürün zorlanabilir.`,
      draft: "Taslak: bu seçenekteki yeni ürünün tarlada kalma süresi henüz onaylanmadı.",
      noneFound: "Bu yanıtlarla ve listemizdeki 20 ürünle, basit kurallarımız bir alternatif üretemedi. Bu, rotasyonunuzun en iyisi olduğu anlamına gelmez.",
      oneFound: "Basit kurallarımız bu yanıtlarla yalnızca bir alternatif üretebildi.",
      emptyTitle: "Neden üç kart yok?",
      emptyMerged: names => `${names} aynı rotasyonu önerdi; tek kartta gösterildi.`,
      emptySoil: "Toprak sağlığı: rotasyonunuza bu iklimde sığan ve toprak puanını artıran bir baklagil bulamadık.",
      emptySoilSingle: "Toprak sağlığı: ürünsüz döneminize bu iklimde sığan bir baklagil bulamadık. Rotasyonunuzda tek ürün olduğu için o ürünü değiştirmeyi önermiyoruz.",
      emptyWater: "Su tasarruflu: ürünlerinizden birinin yerine geçebilecek, buranın yağışına daha uygun ve aynı döneme sığan bir ürün bulamadık.",
      emptyMarket: "Pazar odaklı: kolay sattığınız ürünlerden, bu iklimde rotasyonunuza sığan ve zaten içinde olmayan bir ürün bulamadık.",
      emptyMarketSingle: "Pazar odaklı: kolay sattığınız ürünlerden, ürünsüz döneminize bu iklimde sığan bir ürün bulamadık. Rotasyonunuzda tek ürün olduğu için o ürünü değiştirmeyi önermiyoruz.",
      emptyMarketNoSell: "Pazar odaklı: kolay sattığınız ürünleri seçmediğiniz için bu strateji çalışmadı.",
      stripFallow: "Nadas: 12 ay ürün yok",
      stripBare: k => `${k} ay ürün yok`,
      expert: "Karar vermeden önce yerel bir tarım uzmanına danışın.",
      // "Bilimsel detay" kutuları kısa başlıklı bölümlere ayrılır. İçerik aynıdır; her bölüm, metinde verilen sözcüklerle
      // başlayan cümleden başlar (js/cards.js, Cards.sectioned). İkinci öğe birden çok seçenek olabilir.
      scienceHeads: [["Kurallar", ""], ["Veri", "Ay uygunluğu ve yağış aralıkları"], ["Toprak ve zararlı kuralları", "Kalıcı toprak örtüsü"], ["Su ve mevsim", "Su puanı yıllık yağışa bakar"], ["Ekim zamanı", "Kuru mevsime ekim:"], ["Toprak cümleleri", "Toprak cümleleri:"], ["Model neyi bilmez", "Model nadasın"]],
      futureScienceHeads: [["Ne yapılıyor", ""], ["Isınma ve su", ["Isınmanın suya etkisi:", "Bu yer için buharlaşma"]], ["Kartlar", "Kartlardaki rotasyonlar bugünün"], ["Toprak yönleri", "Toprak yönleri:"]],
      science: "Kurallar proje ekibince belirlendi; bir yapay zeka ya da bitki büyüme modeli değildir. Ay uygunluğu ve yağış aralıkları FAO ECOCROP'tan (Recocrop paketi üzerinden), iklim NASA POWER'ın 2001–2024 aylık ortalamalarından gelir. Kalıcı toprak örtüsü ve en az üç farklı ürünle çeşitlilik, FAO Koruyucu Tarım ilkelerindendir. \"Aynı aileden ürünler art arda gelmesin\" sezgisel bir kuraldır; bazı hastalıklar aileler arasında da geçer. Baklagillerin bağladığı azot miktarı hesaplanmaz. Su puanı yıllık yağışa bakar; mevsimi ayrı bir kuralla denetleriz: sulama yoksa, ürün tarladayken düşen yağış ürünün en az yıllık ihtiyacının üçte birinden azsa o ürün alternatif olarak önerilmez, sizin kendi ürününüzse risk olarak yazılır. Akdeniz gibi kışı yağışlı iklimlerde ilkbaharda ekilen ürünler, kışın toprakta biriken suyu da kullanır. Model toprakta biriken suyu hesaplamadığı için eşik bilinçli olarak gevşek tutuldu (ürünün en az yıllık ihtiyacının üçte biri). Eşik ekibin seçimidir ve Konya ile Jamaika örnekleriyle sınanmıştır. Kuru mevsime ekim: sulama yoksa, ürünün tarladaki ilk iki ayında toplam yağış 30 mm'nin altındaysa ürün alternatif olarak önerilmez; sizin kendi ürününüzse risk olarak yazılır. Kışlık ekim: kışlık süreyle yerleştirme yalnızca o yerin en soğuk ayından 2 ila 4 ay önce başlayabilir (en soğuk aydan hemen önceki ayda başlayamaz); en soğuk ayın ortalama sıcaklığı 15°C'nin üstündeyse o yerde kış yok sayılır ve kışlık yerleştirme yapılmaz. 30 mm, 2–4 ay ve 15°C eşikleri ekibin seçimidir; bir kaynaktan alınmamıştır. İklim uyumu puanında hasat ayı sayılmaz. Toprak cümleleri: kumlu toprağın az su tuttuğu (kum 25–100, kil 175–250 mm/m kullanılabilir su) ve killi toprağın ağır, işlemesi zor olduğu FAO'nun sulama eğitim el kitabındandır (Irrigation Water Management Training Manual No. 1, \"Soil and water\" bölümü); killi toprakta ekimin gecikebileceği genel tarım bilgisidir. Model nadasın toprakta su biriktirmesini, anız örtüsünü, çeşit farklarını, fiyatları ve verimi hesaba katmaz."
    },
    allYear: "Tüm yıl",
    planLabel: "Tarla planı",
    backToMap: "Haritaya dön",
    calTitle: "Tarlanızın bir yılı",
    calLegendRain: "Mavi çubuk: o ayın ortalama yağışı (mm)",
    calLegendTemp: "Renkli kutu: ortalama sıcaklık (°C)",
    calLegendFrost: "❄ Don riski",
    calScience: "2001–2024 yıllarının aylık ortalamaları, NASA POWER (T2M ortalama sıcaklık, PRECTOTCORR yağış, T2M_MIN ayın en düşük sıcaklığı). Bir ay, yılların en az %20'sinde 0°C'nin altına düştüyse don riskli sayılır. NASA POWER yaklaşık 50 km'lik hücrelerle çalışır; yani bu takvim tam olarak tarlanızı değil, bulunduğu bölgeyi anlatır. Ortalamalar yıllar arasındaki farkı gizler; tek bir yıl çok daha yağışlı, kurak ya da soğuk geçebilir.",
    calTip: (m, temp, tmin, rain) => `${m}: ortalama ${temp}°C, ayın en düşük sıcaklığı yaklaşık ${tmin}°C, ${rain} mm yağış`,
    calLead: s => {
      const frost = s.frostAll ? "her ay don görülebiliyor" : s.frost ? `${s.frost} aylarında don görülebiliyor` : "don görülmüyor";
      return `Burada tipik bir yılda ${frost}; en yağışlı aylar ${s.wet}.`;
    },
    calYani: s => {
      const frost = s.frostAll ? "her ay don görülebildiği için yalnızca dona dayanıklı ürünler güvende"
        : s.frost ? `dona dayanıksız ürünler için genellikle en güvenli aylar ${s.frostFree}`
        : "don, ekim zamanını kısıtlamıyor";
      return `Yani: ${frost}. ${s.wet} aylarında yaklaşık ${s.wetMm} mm yağış düşüyor (yıllık toplamın yaklaşık %${s.share} kadarı); ${s.dry} aylarında ise yaklaşık ${s.dryMm} mm.`;
    },
    formTitle: "Tarlanızı anlatın",
    formLead: "Yanıtlarınız yalnızca bu cihazda saklanır.",
    qRotation: "Şu anda ne ekiyorsunuz?",
    rotationHelp: "Ürünlerinizi ektiğiniz sırayla ekleyin. Boş yıl için \"Nadas\", listede olmayan ürün için \"Diğer\" seçin.",
    cropLabel: "Ürün",
    sowLabel: "Ekim ayı",
    harvestLabel: "Hasat ayı",
    cropChoose: "Ürün seçin",
    monthChoose: "Ay",
    addPeriod: "+ Başka ürün ekle",
    removePeriod: "Bu ürünü kaldır",
    sameMonthWarn: "Ekim ve hasat aynı ay görünüyor. Doğru mu?",
    cropScience: "Ürün verisinin kaynağı: FAO ECOCROP (Recocrop paketi üzerinden). Bu, eğilim gösteren basitleştirilmiş bir modeldir. Bir ay, 2001–2024 ortalama sıcaklığı (NASA POWER) ürünün en iyi geliştiği aralıktaysa uygun, dayanabildiği aralıktaysa sınırda, dışındaysa uygun değil sayılır. Don: ürünün öldürücü sıcaklığı ECOCROP'ta varsa, ay yılların en az %20'sinde o sıcaklığın altına düştüyse uygun değil sayılır; yoksa ürünün dona dayanıklı olup olmadığı bilgisi ECOCROP'tan değil proje ekibinden gelir. Kış beklemesi: proje ekibinin kışlık ekilebilir dediği ürünlerde (buğday, arpa, çavdar, kanola, fiğ, mercimek) fazla soğuk ama öldürücü olmayan aylar uygun değil sayılmaz; bitkinin soğukta beklediği varsayılır. Bu bilgi de ECOCROP'tan değil ekipten gelir. Kışlık ekilen tahıllar sonbaharda soğuğa alışarak daha düşük sıcaklıklara dayanabilir; ECOCROP'taki tek değer bunu yansıtmıyor olabilir. Bu yüzden kışlık ürünlerde ekip bilgisi kullanıldı. Çok sert kışlarda ürün yine donabilir; model bunu göstermez. Yağış aylara göre değil, yıllık toplam üzerinden karşılaştırılır (ECOCROP yağış değerleri yıllıktır). Model çeşit farklarını, toprağı ve sulama zamanını bilmez. NASA POWER yaklaşık 50 km'lik hücrelerle çalışır; tam olarak tarlanızı değil bölgenizi anlatır. Karar vermeden önce yerel bir tarım uzmanına danışın.",
    cropCalHead: "Her ayın olağan havası ürünlerinize ne kadar uyuyor?",
    cropLegend: "✓ uygun · ~ sınırda · z kış beklemesi · ✕ uygun değil · soluk aylar: ürün tarlada değil",
    cropStatus: { good: "uygun", edge: "sınırda", wait: "kış beklemesi (bitki soğukta bekler)", bad: "uygun değil" },
    cropCalTitle: (crop, sow, harvest) => `${crop}: ekim ${sow}, hasat ${harvest}`,
    cropCalText: o => {
      const parts = [`${o.good} tanesi uygun`, `${o.edge} tanesi sınırda`];
      if (o.wait) parts.push(`${o.wait} tanesi kış beklemesi`);
      parts.push(`${o.bad} tanesi uygun değil`);
      let s = `Yani: ürünün tarlada olduğu ${o.n} ayın ${parts.join(", ")} görünüyor.`;
      if (o.waitMonths) s += ` ${o.crop} ${o.waitMonths} aylarında soğukta büyümeyi durdurup bekler; bu kışlık ekimde normaldir.`;
      if (o.cold) s += ` ${o.cold}: ortalama sıcaklık bu ürün için fazla düşük.`;
      if (o.hot) s += ` ${o.hot}: ortalama sıcaklık bu ürün için fazla yüksek.`;
      if (o.frost) s += ` ${o.frost}: bu ürünün dayanması beklenmeyen bir don riski var.`;
      if (o.bad > 0) s += o.windows.length
        ? ` Tarlada ${o.n} ay kalan bir ürün, ${o.windows.join(", ")} aylarında ekilirse uygun olmayan aylara denk gelmez.`
        : ` Burada tarlada ${o.n} ay kalan bir ürünü uygun olmayan aylardan uzak tutan bir ekim ayı yok.`;
      return s;
    },
    cropRainText: o => {
      let s = `Yağış: bu bölgeye yılda yaklaşık ${o.rain} mm yağıyor. ${o.crop} en az ${o.rmin} mm ister; ideal miktar ${o.ropmn}–${o.ropmx} mm.`;
      const low = o.level === "low" || o.level === "lowish";
      if (low && o.water === "irrigated") s += " Yani: yağış tek başına az, ama suladığınız için belirleyici değil.";
      else if (o.level === "low") s += o.water === "limited"
        ? " Yani: yağış tek başına yetmez; kısıtlı sulama da açığı kapatmayabilir."
        : " Yani: sulama olmadan buradaki yağış bu ürüne yetmeyebilir.";
      else if (o.level === "lowish") s += " Yani: yağış ürünü yetiştirmeye yeter, ama ideal miktarın altında.";
      else if (o.level === "ok") s += " Yani: yıllık yağış bu ürün için ideal aralıkta.";
      else if (o.level === "highish") s += ` Yani: yağış ideal miktarın üstünde, ama ${o.rmax} mm olan üst sınırının altında.`;
      else s += ` Yani: bu, ${o.rmax} mm olan üst sınırından fazla; ürün için fazla yağışlı olabilir.`;
      if (!o.water && low) s += " (Aşağıdaki sulama sorusunu yanıtlarsanız bu cümle netleşir.)";
      return s;
    },
    rotationInfo: s => `Girdiğiniz sıraya göre bu rotasyon yaklaşık ${s.years} yılda bir tekrar ediyor; bu ${s.months} ayın yaklaşık ${s.bare} ayında tarlada ürün yok.`,
    formErrorRotation: "Lütfen en az bir ürün ekleyin ve eklediğiniz her ürün için ekim ve hasat ayını seçin.",
    qSoil: "Toprağınız nasıl?",
    qWater: "Tarlayı sulayabiliyor musunuz?",
    qSlope: "Tarlanız ne kadar eğimli?",
    qPriorities: "Sizin için ne kadar önemli?",
    prioHelp: "Her kaydırıcıyı ayarlayın: 1 = benim için önemli değil, 5 = çok önemli.",
    prio: { water: "Su tasarrufu", soil: "Toprak sağlığı", income: "Ek gelir" },
    // 5 dakikalık tarla testi (js/plan.js, FieldCheck). Adım metinleri ekibin verdiği hâliyle; puanlamaya girmez.
    fcOpen: "Emin değil misiniz? 5 dakikalık tarla testi yapın",
    fc: {
      title: "5 dakikalık tarla testi",
      step: (n, total) => `Adım ${n} / ${total}`,
      heads: ["Toprak dokusu", "Su tutma (drenaj)", "Eğim", "Geçen yıl"],
      tasks: [
        "Bir avuç toprak alın, biraz ıslatın ve avucunuzda yoğurun.",
        "Yağmurdan bir gün sonra tarlada su birikintisi kalıyor mu?",
        "Tarlanın bir ucundan diğerine yürüyün. Yokuş hissediyor musunuz? Yağmurda su bir yöne akıp toprak taşıyor mu?",
        "Geçen yılı kısaca not edin. Bu cevaplar yalnızca kayıt içindir; puana girmez."
      ],
      texture: {
        sandy: "Dağılıyor, top olmuyor, kumlu hissediliyor",
        loam: "Top oluyor ama şerit yapınca 2–3 cm'de kırılıyor",
        clay: "Parmaklar arasında 5 cm'den uzun, parlak bir şerit oluyor; yapışkan"
      },
      drain: { often: "Evet, sık sık", sometimes: "Bazen", no: "Hayır" },
      drainNote: "Formda bu soruya karşılık gelen bir soru yok; cevabınız yalnızca kaydedilir ve puana girmez.",
      filled: (q, v) => `Formdaki "${q}" sorusu "${v}" olarak dolduruldu. İsterseniz aşağıdan değiştirebilirsiniz.`,
      lastCrop: "Geçen yıl ne ekildi?",
      lastYield: "Verim nasıldı?",
      yield: { good: "İyi", mid: "Orta", poor: "Kötü" },
      lastProblems: "Yaşanan sorun (birden fazla seçebilirsiniz)",
      problems: { drought: "Kuraklık", waterlog: "Su birikmesi", pest: "Zararlı", disease: "Hastalık", none: "Yok" },
      back: "Geri", next: "İleri", finish: "Bitir", close: "Kapat", again: "Baştan başla",
      doneTitle: "Tarla testi tamamlandı",
      doneEmpty: "Hiçbir adımı yanıtlamadınız.",
      doneHint: "Toprak dokusu ve eğim cevabınız aşağıdaki soruları doldurdu. Diğer cevaplar yalnızca kayıttır; profil kaydederseniz \"Tarla testi\" kartında görünür.",
      note: "Bu bir saha gözlemidir; kesin sonuç için toprak analizi yaptırın.",
      source: "Yöntem: FAO / USDA NRCS 'soil texture by feel'",
      rows: { texture: "Toprak dokusu", drain: "Yağmurdan sonra su birikintisi", slope: "Eğim", lastCrop: "Geçen yıl ekilen", lastYield: "Geçen yılın verimi", problems: "Geçen yıl yaşanan sorun" },
      cardTitle: "Tarla testi",
      cardNote: "Bunlar sizin saha gözlemlerinizdir. Toprak dokusu ve eğim cevabı formdaki soruyu doldurur; diğerleri yalnızca kayıttır ve puana girmez."
    },
    opts: {
      soil: {
        sandy: ["Kumlu", "Elde pütürlüdür, dağılır; su çabuk süzülür."],
        loam: ["Tınlı (orta)", "Yumuşaktır, ufalanır; sıkınca gevşek bir topak olur."],
        clay: ["Killi", "Islakken yapışır, kuruyunca sertleşip çatlar."],
        unknown: ["Bilmiyorum", "Sorun değil; bunu eksik bilgi olarak göstereceğiz."]
      },
      water: {
        irrigated: ["Sulu", "Ürün istediğinde sulayabiliyorum."],
        limited: ["Kısıtlı su", "Birkaç kez sulayabiliyorum ama sezon boyunca yetmiyor."],
        rainfed: ["Kuru (yağmura bağlı)", "Sulama yok; ürün yağmura bağlı."]
      },
      slope: {
        flat: ["Düz", "Yağmur suyu akıp gitmez."],
        gentle: ["Hafif eğimli", "Şiddetli yağmurda su yavaşça akar."],
        steep: ["Dik", "Su hızla akar; toprak kolayca taşınır."]
      }
    },
    summaryLabels: { rotation: "Mevcut rotasyon", soil: "Toprak", water: "Su", slope: "Eğim", sell: "Kolay satılanlar" },
    continueBtn: "Devam",
    resetAnswers: "Yanıtları sıfırla",
    answersCleared: "Yanıtlarınız silindi.",
    formError: "Lütfen toprak, su ve eğim sorularını yanıtlayın.",
    summaryTitle: "Yanıtlarınız",
    expertNote: "Bu araç kararınızı destekler, yerine geçmez. Ekim planınızı değiştirmeden önce yerel bir tarım uzmanına danışın.",
    months: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
    yani: (r, t) => {
      const rain = Math.abs(r) < 3 ? "yağış pek değişmemiş" : `yağış %${Math.abs(r)} ${r > 0 ? "artmış" : "azalmış"}`;
      const temp = Math.abs(t) < 0.2 ? "sıcaklık pek değişmemiş" : `hava ortalama ${fmt(Math.abs(t), 1)}°C ${t > 0 ? "ısınmış" : "serinlemiş"}`;
      return `Yani: 2000'lerin başına göre son yıllarda burada ${rain}, ${temp}.`;
    }
  },
  en: {
    searchPlaceholder: "Search a village, town or city",
    locate: "Use my location",
    pickOnMap: "I'll pick on the map",
    layersTitle: "Show on map",
    moreLayers: "More layers",
    lessLayers: "Show less",
    scienceDetail: "Science details",
    source: "Data",
    hintTitle: "Where is your field?",
    hintText: "Tap your field on the map, search for a place above, or use your location.",
    yourField: "Selected place",
    selectedPoint: "Selected point",
    factRain: "Yearly rain",
    factHot: "Hottest month",
    factFrost: "Frost risk",
    noFrost: "None",
    tabRain: "Rain",
    tabTemp: "Temperature",
    chartNote: "Years 2001–2024, NASA POWER",
    chartRain: "Yearly rain (mm)",
    chartTemp: "Yearly mean temperature (°C)",
    createRotation: "Create a plan for this field",
    play: "Play the past",
    pause: "Pause",
    speed: "Speed",
    loadingClimate: "Getting 24 years of NASA climate data for this place…",
    climateError: "Climate data could not be loaded. Check your connection and try again.",
    locating: "Finding your location…",
    locateError: "Couldn't get your location. Pick on the map or search instead.",
    noResults: "No results",
    tileError: "No image for this date, move to the next one.",
    // ---------- Pages: menu, home, farmers, about (js/pages.js) ----------
    brandSub: "Crop rotation decisions with NASA data",
    navHome: "Home",
    navPlan: "Plan my field",
    navFarmers: "From the Field",
    farmersKicker: "Farmers' comments",
    soonBadge: "Coming soon",
    farmersWrite: "Write a comment →",
    navAbout: "About us",
    navProfile: "My field",
    profileKicker: "Prototype",
    profileTitle: "My field profile",
    profileWarn: "Prototype: data is stored only in this browser. In the future, farmers' notes will be used to improve the rules.",
    profile: {
      intro: "Keep your field and your rotation in this browser, and write a short field note each month. We do not ask for an account, a password or an e-mail address.",
      demoBtn: "Try a demo profile",
      demoHint: "One click loads a ready-made example: Konya, wheat + fallow, sample field notes. No password or account needed.",
      demoTitle: "Demo profile: saved field",
      demoNotice: "This is a demo profile. The field, the answers and the notes are examples; they do not belong to a real farmer. To create your own profile, delete this demo first (at the bottom of the page).",
      demoBadge: "Sample",
      demoNotes: [
        "Sample note: after the rain the soil is moist; the wheat has started to come up.",
        "Sample note: wheat sown. The soil is dry; we are waiting for rain.",
        "Sample note: getting ready for sowing. The soil is dry and hard."
      ],
      needTitle: "To create a profile, first choose your field and enter your rotation.",
      field: "Field",
      answers: "Soil, water and slope answers",
      missing: "not yet",
      goPlan: "Plan my field →",
      createTitle: "Create a profile",
      createLead: "The field you chose and the rotation you entered on the plan screen will be saved:",
      nameLabel: "Your name (optional)",
      namePlaceholder: "For example: Ayşe",
      noAccount: "No password and no e-mail. Your answers and your profile are not sent to any server. To fetch data, only the coordinates of the selected point (and the place name you type in the search) are sent to NASA POWER, NASA GIBS and OpenStreetMap's Nominatim.",
      createBtn: "Create profile",
      noStore: "This browser does not allow saving (for example in a private window). The profile will last only while this page is open.",
      savedTitle: "Saved field",
      savedTitleName: n => `${n}: saved field`,
      created: d => `The profile was created in this browser on ${d}.`,
      satAlt: "Satellite image of the area around the saved point (could not be loaded)",
      satCaption: d => `Image: NASA GIBS / MODIS_Terra_CorrectedReflectance_TrueColor, ${d} (a fixed date; your area may be cloudy on that day). The mark in the middle is the saved point; the picture covers about 118 km × 66 km, not a single field.`,
      statCurrent: "Current rotation: rule-based score",
      statBest: "Suggested rotation: rule-based score",
      statSame: "your current rotation",
      statNotes: "Saved notes",
      statLast: "Last note",
      adviceTitle: "Our suggestion for this year",
      adviceKeep: s => `We ran the rule-based comparison again for your saved field. Among the options we found, the highest score belongs to your current rotation (${s} / 5).`,
      adviceOnly: s => `We ran the rule-based comparison again for your saved field. Our rules did not produce an alternative for your rotation; its score is ${s} / 5.`,
      adviceChange: (b, c) => `We ran the rule-based comparison again for your saved field. The option with the highest score is below (${b} / 5); your current rotation scores ${c} / 5.`,
      adviceNote: "This is not a forecast. The calculation uses 2001–2024 climate averages; it does not know this year's weather. Talk to a local agricultural adviser before you decide.",
      adviceMore: "To see all options and the details: Plan my field →",
      retry: "Try again",
      noteTitle: "Monthly field note",
      noteLead: "Once a month, write briefly what you see in your field. For now the notes are only for you; they are not used in the calculation.",
      noteDate: "Date",
      noteMoisture: "How does the soil feel in your hand?",
      moisture: { dry: "Dry", normal: "Normal", wet: "Wet" },
      noteText: "Note (optional)",
      notePlaceholder: "For example: the wheat has come up; water stood in the lower corner.",
      noteError: "Choose the date (today or earlier) and mark how the soil feels.",
      noteSave: "Save note",
      notesTitle: n => `My notes (${n})`,
      notesEmpty: "No notes yet.",
      noteDelete: "Delete",
      deleteTitle: "Delete profile",
      deleteBtn: "Delete profile",
      deleteConfirm: "The profile and all notes will be deleted from this browser. This cannot be undone. Are you sure?",
      deleteYes: "Yes, delete",
      deleteNo: "Cancel"
    },
    homeTitle: "Your rotation, side by side with alternatives.",
    homeLead: "Pick your field anywhere on Earth. See what 25 years of NASA data say about your area, then compare your rotation and its alternatives.",
    homeCta: "Plan my field →",
    storyNdviTitle: "Satellites have watched your fields for 25 years.",
    storyNdviText: "How green the land is, month by month, since 2001. The picture shows your region, not a single field.",
    storySoilTitle: "NASA has estimated how wet the soil is, month by month, since 2001.",
    storySoilText: "This is a model-assisted product (GLDAS), not a direct measurement.",
    storyThirdTitle: "Temperature, month by month, since 2001.",
    storyThirdText: "From NASA's MERRA-2 record. For the scores of your own field we use NASA POWER data for your area.",
    homeCompareTitle: "With this data, we compare your rotation with up to three alternatives.",
    homeCompareText: "Each option comes with its reasons, the data behind it, what we do not know, and its risks.",
    homeCompareYani: "In other words: you and your local adviser decide. This is a rule-based comparison, not a forecast.",
    homeStep1: "Find your field",
    homeStep1Text: "Search, tap the map, or use your location.",
    homeStep2: "Play the past",
    homeStep2Text: "Six NASA layers, 2001 to 2026.",
    homeStep3: "Describe your field",
    homeStep3Text: "Crops, soil, water, priorities.",
    homeStep4: "Compare, then test the climate",
    homeStep4Text: "Your rotation and its alternatives; warmer and drier climate sliders.",
    homeNumLayers: "NASA map layers",
    homeNumYears: "years of climate record",
    homeNumCrops: "crops",
    homeNumZero: "accounts, trackers or AI models",
    homeEndTitle: "See it for your own field.",
    homeEndNote: "Data: NASA GIBS, NASA POWER, FAO ECOCROP, © OpenStreetMap contributors. Satellite data describe the region around a field, not the single field.",
    farmersTitle: "What do farmers in this region say?",
    farmersLead: "Farmers will be able to share what worked on their own land. Comments will be shown by region, in the farmer's own words.",
    farmersEmpty: "There are no comments yet. Be the first to write one.",
    farmersFormSoon: "The comment form will open soon. Until the link arrives this button does nothing and sends nothing.",
    farmersRulesTitle: "How comments will work",
    farmersRule1: "We do not write comments in farmers' names. The example cards above are clearly marked as examples; they are not real comments.",
    farmersExampleNote: "No real farmer comments yet. The cards below are examples showing how this section will look.",
    farmersExampleLabel: "Example comment (for testing) — not from a real farmer",
    farmersImageRegions: ["the Konya plain", "Punjab around Ludhiana", "Jamaica"],
    farmersImageAlt: r => `Satellite image of ${r} (could not be loaded)`,
    farmersImageSource: "Images: NASA GIBS / MODIS_Terra_CorrectedReflectance_TrueColor (MODIS Terra true colour). Konya plain: 20 July 2026; Punjab around Ludhiana: 12 March 2025; Jamaica: 19 February 2026. The pictures show the region only, not any farmer's field.",
    farmersRule2: "Identity is not verified. A comment is one farmer's personal experience; it is not advice. Your field may be different.",
    farmersRule3: "Only a first name and the district are shown, never a surname, phone number, e-mail or the location of a field.",
    farmersRule4: "Comments are shown in the language they were written in.",
    farmersLink: "What do farmers in this region say? →",
    farmersLinkSoon: "No comments yet; the comment form will open soon.",
    aboutKicker: "NASA Space Apps Challenge 2026 · Field Shift challenge",
    aboutTitle: "About DECO",
    aboutLead: "DECO: DEcision support for CrOp rotation. It helps a farmer compare the rotation they grow today with up to three alternatives, using NASA data for their area.",
    aboutImageCap: "Image: NASA GIBS / MODIS_Terra_CorrectedReflectance_TrueColor (MODIS Terra true colour), 20 July 2026. Konya plain, Türkiye: green patches are places where plants are green in July; the white area at the top is Tuz Gölü, a salt lake.",
    aboutImageAlt: "Satellite image of the Konya plain, Türkiye (could not be loaded)",
    aboutHowTitle: "How to use it",
    aboutHow1: "Choose your field: on the \"Plan my field\" page, search for a place, press \"Use my location\" or click on the map.",
    aboutHow2: "Look at the past: pick a NASA layer and press \"Play the past\". The field card shows a 2001–2024 rain and temperature summary for your area.",
    aboutHow3: "Describe your field: press \"Create a plan for this field\" and enter your current rotation (crop, sowing month, harvest month), soil, water, slope, your priorities and the crops you can sell easily.",
    aboutHow4: "Compare rotations: your own rotation next to up to three alternatives. \"Look into this option\" shows how the scores came out and a transition calendar.",
    aboutHow5: "Move the \"What if the climate changes?\" sliders; if you like, save your field on the \"My field\" page and keep a monthly note. Talk to a local agricultural adviser before you decide.",
    aboutFutureTitle: "Future plans",
    aboutFutureLead: "These are plans; none of them is done yet.",
    aboutFuture1: "Real accounts, so that a profile can be opened from other devices (for now the profile is a prototype that lives only in the browser).",
    aboutFuture2: "Improving the rules with farmers' notes and comments.",
    aboutFuture3: "Training modules: short, plain explanations of crop rotation and soil health.",
    aboutFuture4: "Taking the slope automatically from SRTM and the soil type from SoilGrids (we have not tried these two sources yet).",
    aboutFuture5: "More crops.",
    aboutFuture6: "Sowing-time alerts based on short-term weather forecasts (Meteomatics).",
    aboutFuture7: "Our own domain name.",
    aboutTeamTitle: "Team",
    aboutTeam: "DECO Team",
    aboutChallengeTitle: "The challenge",
    aboutChallenge: "The challenge asks for a tool that compares at least three crop rotations, including the one the farmer uses now, and shows for each why it is suggested, the data behind it, its benefits, what is not known, and its risks.",
    aboutMethodTitle: "How it works, honestly",
    aboutMethod1: "The comparison is rule-based. It is not artificial intelligence, not a forecast and not a crop growth model.",
    aboutMethod2: "Climate comes from NASA POWER (2001–2024 monthly averages); crop needs come from FAO ECOCROP.",
    aboutMethod3: "Each rotation gets six scores from 1 to 5: climate fit, water, nitrogen, soil cover, pest cycle and sellability. Your priorities set the weights.",
    aboutMethod4: "Alternatives change one thing in your rotation: they fill an empty period or replace one crop.",
    aboutMethod5: "Some thresholds were chosen by the team and were tried in only six places. The site marks them as such.",
    aboutMethod6: "Satellite and climate data describe the region around a field, not the single field. Talk to a local adviser before changing what you plant.",
    aboutSourcesTitle: "Sources",
    aboutSourcesLead: "Only sources that the site actually uses are listed.",
    aboutLicenceTitle: "Licence",
    aboutLicence: "Our code is released under the MIT License. The licence covers the code only; the data and the libraries are used under their own terms.",
    pg: {
      exHead: "Example: Konya, rain-fed",
      exYour: "Your rotation",
      exYourNote: "Rule-based comparison score",
      exSoil: "Soil health option",
      exSoilNote: "adds nitrogen, leaves less bare soil",
      exWater: "Water saving option",
      exWaterNote: "a crop closer to the rain this area gets"
    },
    // ---------- Stage 3: questions added to the form ----------
    otherOption: "Other (not on the list)",
    otherNameLabel: "Crop name",
    otherNamePlaceholder: "e.g. sesame",
    otherDefault: "Other crop",
    otherCalNote: n => `We have no data for ${n}; month-by-month suitability cannot be shown.`,
    fallowOption: "Fallow (empty year)",
    fallowShort: "Fallow",
    fallowNote: "The field stays empty for 12 months; no sowing or harvest month is needed.",
    qSell: "Which crops can you sell easily in your area?",
    sellHelp: "Pick as many as you like. We do not calculate money.",
    sellNone: "none selected",
    optionsTitle: "Rotation options",
    optionsLead: "Your rotation and up to three alternatives produced by simple rules. The scores are not a forecast; they are a rule-based comparison.",
    // ---------- Stage 4: fixed texts of the "future climate" slider box ----------
    futureTitle: "What if the climate changes?",
    futureDisclaimer: "This is not a forecast; it is a comparison showing what our rules would say if the climate changed.",
    futureTempLabel: "Temperature",
    futureRainLabel: "Rain",
    futureReset: "Back to today",
    // ---------- Stage 3: card texts. Risk and information-gap sentences were approved by the team (14 Nov 2026). ----------
    s3: {
      // ---------- Stage 4 texts ----------
      tempVal: v => (v ? `+${v}°C` : "as today"),
      rainVal: v => (v ? `${v > 0 ? "+" : "−"}${Math.abs(v)}%` : "as today"),
      tempShort: v => (v ? `+${v}°C` : "temperature as today"),
      rainShort: v => (v ? `rain ${v > 0 ? "+" : "−"}${Math.abs(v)}%` : "rain as today"),
      futureSticky: (a, b) => `Chosen climate: ${a}, ${b} · change`,
      futureIdle: "Move the sliders; the scores and risks on the cards are recalculated.",
      futureScenario: (dT, dP) => {
        const rain = `${Math.abs(dP)}% ${dP > 0 ? "more" : "less"} rain`;
        if (dT && dP) return `in a climate that is ${dT}°C warmer with ${rain}:`;
        return dT ? `in a climate that is ${dT}°C warmer:` : `in a climate with ${rain}:`;
      },
      futureYani: (scenario, text) => `In other words: ${scenario} ${text}`,
      futureNoChange: "In other words: within this range the scores do not change under our rules.",
      futureCrit: (name, up, down) => {
        const parts = [];
        if (up) parts.push(`rises on ${up} card${up > 1 ? "s" : ""}`);
        if (down) parts.push(`falls on ${down} card${down > 1 ? "s" : ""}`);
        return `The "${name}" score ${parts.join(" and ")}.`;
      },
      futureTopSame: n => `The highest total score is still: ${n}.`,
      futureTopNew: (n, o) => `The highest total score is now: ${n} (today: ${o}).`,
      futureCold: "Under our rules, warming makes the winter months more suitable for crops here; extreme heat and drought are not part of this comparison.",
      futureCool: "Under our rules, warming makes the cool months more suitable for crops here; extreme heat and drought are not part of this comparison.",
      futureTied: " (tied)",
      futureLessRain: names => `Rain here was above the ideal amount for ${names}; under our rules, less rain brings it closer to the ideal.`,
      riskEtNote: "(in the selected climate, after evaporation)",
      futureWarn: "In warmer weather, plants and soil lose more water. We roughly accounted for this with a simple FAO method; heat waves and drought years are not part of this comparison.",
      futureAltShown: n => `In this climate our rules would favour a different alternative: ${n} (one of the cards below).`,
      futureAltOther: n => `In this climate our rules would favour another alternative: ${n}. The cards were chosen for today's climate and are kept fixed.`,
      futureNew: "new",
      futureMark: v => `Today's score: ${v}`,
      evFuture: (r, today, et) => `Yearly rain used in the calculation for the chosen climate: about ${r} mm (today ${today} mm)` + (et ? "; higher evaporation has been roughly deducted." : "."),
      blockSoil: "Direction of the effect on soil over the years",
      soil: {
        dir: {
          erosion: {
            down: "Erosion risk: tends to decrease compared with your rotation (less of the rain falls on bare soil).",
            up: "Erosion risk: tends to increase compared with your rotation (more of the rain falls on bare soil).",
            same: "Erosion risk: similar to your rotation."
          },
          nitrogen: {
            up: "Soil nitrogen: tends to increase compared with your rotation (higher share of legumes).",
            down: "Soil nitrogen: tends to decrease compared with your rotation (lower share of legumes).",
            same: "Soil nitrogen: similar to your rotation."
          },
          organic: {
            up: "Organic matter: tends to increase compared with your rotation (the field is covered by a crop for more months).",
            down: "Organic matter: tends to decrease compared with your rotation (the field is covered by a crop for fewer months).",
            same: "Organic matter: similar to your rotation."
          }
        },
        level: {
          erosion: {
            low: "Erosion risk: on the low side (based on the soil cover score).",
            mid: "Erosion risk: medium (based on the soil cover score).",
            high: "Erosion risk: on the high side (based on the soil cover score)."
          },
          nitrogen: {
            none: "Soil nitrogen: there is no legume in the rotation; the crops do not add nitrogen to the soil.",
            some: "Soil nitrogen: the legumes in the rotation add nitrogen to the soil."
          },
          organic: (occ, months) => `Organic matter: the field is covered by a crop in ${occ} of ${months} months. The more covered months, the more organic matter tends to build up.`
        },
        note: "These directions show the difference between rotations; the climate sliders do not affect them. No amounts are calculated."
      },
      futureScience: (et0, pct, dT) => "This is not a new crop model: the rule-based comparison above is re-run with a shifted climate. The temperature slider adds the same number of degrees to the average and the lowest temperatures of all 12 months; the rain slider changes the rain of all 12 months by the same percentage. Real climate change is not spread evenly over the months, so this is not a climate projection. " +
        (et0 === null
          ? "The data needed for the evaporation calculation is missing for this place; the effect of warming on water could not be included. "
          : `Effect of warming on water: reference evapotranspiration is calculated with the Hargreaves equation in FAO-56 (equation 52); the daily temperature range (T2M_RANGE) and extraterrestrial radiation (TOA_SW_DWN) come from NASA POWER and are assumed not to change. In months averaging below −17.8°C, evaporation is counted as zero. Today's yearly reference evapotranspiration here is about ${et0} mm. ` +
            (pct === null ? "" : `At +${dT}°C it rises by about ${pct}%. `) +
            "When the temperature slider is not zero, each month's rain is divided by the ratio by which yearly evaporation rises (\"effective rain\"). This is a rough correction: it does not include heat waves, drought years, the effect of carbon dioxide on plants or shrinking irrigation water. ") +
        "The rotations on the cards are chosen for today's climate and stay fixed. Soil directions: erosion risk looks at the share of rain falling on bare soil (the direction changes when the alternative's share differs by at least 10 points; 10 points was chosen by the team); nitrogen looks at the share of legumes; organic matter looks at the share of months the field is covered by a crop (FAO Conservation Agriculture's principle of keeping the soil covered). These are directions, not amounts.",
      strategy: { current: "Your rotation", soil: "Soil health", water: "Water saving", market: "Market focused", other: "Another possibility" },
      strong: "Your rotation already looks strong in this comparison.",
      neutral: "Our strategies did not find a clear improvement; other ideas are shown below for comparison.",
      whyOther: "Our strategies did not find two options that improve your rotation. This is one of the highest-scoring rotations that can be reached with a single change.",
      versusOtherLower: "This option is shown for comparison; its overall score is lower than your rotation's.",
      riskSowing: (n, mm) => `Only about ${mm} mm of rain falls here in the first two months after ${n} is sown. Without irrigation, emergence and early growth may struggle.`,
      criteria: { climate: "Climate fit", water: "Water", nitrogen: "Nitrogen", cover: "Soil cover", pest: "Pest cycle", sell: "Sellability" },
      scoreLabel: "Rule-based comparison score",
      how: "How was this calculated?",
      howText: {
        climate: "How well the months the crops are in the field suit those crops. A suitable month counts fully, a borderline month counts half, an unsuitable month counts zero. Winter-pause months and the harvest month are left out.",
        water: "Where this area's yearly rain falls within the rain range each crop wants. If you irrigate, low rain costs fewer points.",
        nitrogen: "How many of the crops are legumes. Legumes add nitrogen to the soil.",
        cover: "How much of the rain falls on bare soil. The less, the higher the score. A steep field loses 1 point; a flat field gains 1.",
        pest: "How many crops are followed by a crop from a different family. A fallow year also breaks the cycle. With fewer than three different crops the score is capped at 4.",
        sell: "How many of the crops are among those you said you can sell easily."
      },
      howWeights: (w, s, i, noSell) => `The total is a weighted average of these six scores. Climate fit always counts with weight 3. The water score is weighted by your "saving water" slider (${w}), and the average of the three soil scores (nitrogen, soil cover, pest cycle) by your "soil health" slider (${s}).` +
        (noSell ? " Sellability was left out of the total because you did not pick any easy-to-sell crops." : ` Sellability is weighted by your "extra income" slider (${i}).`),
      one: {
        current: "This is the rotation you entered. The other options are compared with it.",
        soil: { fill: n => `Grows ${n} in the empty period, adding nitrogen and leaving the soil bare for less time.`, swap: (n, o) => `${n}, a legume, instead of ${o}: adds nitrogen to the soil.` },
        water: { swap: (n, o) => `${n} instead of ${o}: a crop closer to the rain this area gets.`, fill: n => `${n}: a crop that suits the rain this area gets.` },
        market: { fill: n => `Grows ${n}, which you can sell easily, in the empty period.`, swap: (n, o) => `${n}, which you can sell easily, instead of ${o}.` },
        other: { fill: n => `Grows ${n} in the empty period.`, swap: (n, o) => `${n} instead of ${o}.` }
      },
      why: {
        soil: n => `${n} is a legume; it raises the share of legumes in your rotation.`,
        water: (n, o) => `${n} can manage with less rain than ${o}.`,
        market: n => `${n} is one of the crops you said you can sell easily.`
      },
      versusLine: (up, name, a, b) => `${up ? "↑ Better" : "↓ Worse"}: ${name} (${a} → ${b})`,
      versusSame: "The scores are close to your rotation's.",
      versusLower: name => `Better on ${name.toLowerCase()}; its overall score is lower than your rotation's.`,
      blockWhy: "Why this option?",
      blockVersus: "Compared with yours",
      blockEvidence: "Evidence",
      blockGaps: "Information gaps",
      blockRisks: "Risks",
      none: "Our rules found nothing.",
      evRain: r => `This area gets about ${r} mm of rain a year (NASA POWER, 2001–2024 average).`,
      evBare: p => `About ${p}% of the rain falls while the soil has no crop (NASA POWER monthly rain).`,
      evInField: (n, mm) => `About ${mm} mm of rain falls here while ${n} is in the field (NASA POWER).`,
      evCrop: (n, a, b, c) => `${n}: needs at least ${a} mm of rain a year; the ideal is ${b}–${c} mm (FAO ECOCROP).`,
      evWater: (n, a, b) => `${n} uses about ${a}–${b} mm of water in one growing period (FAO irrigation manual, 1986).`,
      gapDuration: n => `${n}: the time it stays in the field is a draft value awaiting team approval. The suggested sowing and harvest months may change.`,
      reorderBest: "For your crops, your arrangement already looks best under our rules.",
      reorderBetter: (changes, a, b) => `With the same crops, this change raises the score: ${changes} (${a} → ${b}).`,
      reorderSow: (name, from, toIn, harvest) => `sow ${name} ${toIn} instead of ${from} (harvest: ${harvest})`,
      reorderOrder: seq => `use this order: ${seq}`,
      monthsIn: ["in January", "in February", "in March", "in April", "in May", "in June", "in July", "in August", "in September", "in October", "in November", "in December"],
      inspect: "Look into this option",
      inspectClose: "Close the details",
      detail: {
        title: n => `Details: ${n}`,
        future: (a, b) => `These numbers are for the climate you chose (${a}, ${b}). For today's numbers press "Back to today" above.`,
        sciTitle: "How the scores came out",
        sciLead: "For each criterion: the score, the rule and the data used. Only numbers that we calculate are shown; we do not calculate yield, fertiliser or seed amounts.",
        climateCrop: (n, span, months, st, o1, o2, t1, t2) => `${n} (${span}): ${months} months in the field (harvest month included): ${st.good} suitable, ${st.edge} borderline, ${st.wait} winter pause, ${st.bad} not suitable. FAO ECOCROP: best at ${o1}–${o2}°C, tolerates ${t1}–${t2}°C.`,
        climateSum: (g, e, b, n, s) => `${n} months count towards the score (harvest months and winter pause are left out): ${g} suitable, ${e} borderline, ${b} not suitable. Score = 1 + 4 × (${g} + ${e} ÷ 2) ÷ ${n} = ${s}.`,
        climateNone: "No month counts towards the score (only a harvest month or winter pause); the score is taken as 3.",
        climateData: "Data: monthly mean temperature and frost months, NASA POWER 2001–2024.",
        waterRain: r => `Yearly rain here: ${r} mm (NASA POWER, 2001–2024 average).`,
        waterRainFuture: (r, today) => `Yearly rain used in the calculation for the chosen climate: ${r} mm (today ${today} mm).`,
        waterCrop: (n, min, o1, o2, max, s, span, inField, start) => `${n}: FAO ECOCROP yearly rain range: at least ${min}, ideal ${o1}–${o2}, at most ${max} mm; this crop's water score is ${s}. Rain while it is in the field (${span}): ${inField} mm; in its first two months: ${start} mm.`,
        waterMode: {
          rainfed: "No irrigation: the score depends on rain only.",
          limited: "Limited irrigation: if rain is below the ideal, one third of the gap to 5 is added to the score.",
          irrigated: "Irrigated: if rain is below the ideal, half of the gap to 5 is added to the score."
        },
        waterAvg: s => `The water score is the average over the crops: ${s}.`,
        nitrogen: (n, k, names, pct, s) => (k ? `${k} of ${n} crops are legumes (${names}); share ${pct}%; score ${s}.` : `None of the ${n} crops is a legume; score ${s}.`),
        nitrogenNote: "Rule: no legume 1; a share below one third 3; below one half 4; one half or more 5. The amount of nitrogen fixed is not calculated. A crop that is not on the list (\"Other\") is not counted as a legume.",
        cover: (pct, base) => `About ${pct}% of the rain in the cycle falls while the soil has no crop; that share scores ${base} (up to 15%: 5; 30%: 4; 50%: 3; 70%: 2; more: 1).`,
        coverSlope: { flat: "The field is flat: 1 is added (5 at most).", gentle: "Gentle slope: no change.", steep: "The field is steep: 1 is taken off (1 at least)." },
        coverScore: s => `Soil cover score: ${s}.`,
        coverData: "Data: monthly rain, NASA POWER 2001–2024. Fallow and months without a crop count as bare soil.",
        pest: (n, same) => `Of ${n} successions in the cycle, ${same} are within the same plant family.`,
        pestFamilies: f => `Families (FAO ECOCROP): ${f}.`,
        pestFallow: "A fallow year counts like a different crop.",
        pestDistinct: n => `Number of different crops: ${n}. With fewer than three the score is capped at 4.`,
        pestScore: s => `Pest cycle score: ${s}.`,
        sell: (n, k, names, s) => `${k} of ${n} crops are among those you can sell easily${k ? ` (${names})` : ""}. Score = 1 + 4 × ${k} ÷ ${n} = ${s}.`,
        sellNoKnown: "Not calculated because the rotation has no crop from our list.",
        total: (terms, weights, s) => `Total = (${terms}) ÷ (${weights}) = ${s}.`,
        totalSoil: (a, b, c, s) => `The number multiplied by the "soil health" weight is the average of the three soil scores: (${a} + ${b} + ${c}) ÷ 3 = ${s}.`,
        totalRound: "Numbers are shown rounded to one decimal; a hand calculation can differ slightly.",
        calTitle: "Transition calendar",
        calOwn: "This is your current rotation. Year by year, sowing and harvest fall like this:",
        calFrom: cur => `Your current rotation: ${cur}. If you move to this option, sowing and harvest would fall like this, year by year:`,
        calWhen: (y, m) => `Year ${y}, ${m}`,
        calRange: (y1, m1, y2, m2) => `Year ${y1} ${m1} – year ${y2} ${m2}`,
        calSow: n => `sow ${n}`,
        calHarvest: n => `harvest ${n}`,
        calFallow: "Fallow (field empty)",
        tagNew: "new",
        tagSame: "same",
        calRepeat: (years, bare, months) => `Then the cycle starts again (every ${years} year${years > 1 ? "s" : ""}). In ${bare} of these ${months} months the field has no crop.`,
        calGone: names => `Leaves your current rotation: ${names}.`,
        calStart: "The calendar shows months only. Decide with your local adviser which year to start the change and what to do in the first year.",
        helpTitle: "Want help?",
        helpAdviser: "Ask your local agricultural adviser about: choice of variety, seed rate, soil analysis.",
        profileBtn: "Create a field profile for more information",
        profileNote: "Prototype: data stay only in this browser."
      },
      ideasSummary: n => `More ideas (${n})`,
      ideasTitle: "Other rotation ideas for your region",
      ideasLead: "These rotations are independent of what you grow; they are ideas that our rules bring forward for the climate of your region.",
      ideasUnknown: "We do not know whether these crops are actually grown in your region; ask a local adviser.",
      ideasNone: "With these answers our rules could not produce another idea.",
      ideaKicker: n => `Idea ${n}`,
      ideaOneNew: names => `Crops that are not in your rotation: ${names}.`,
      ideaOneSame: "A different rotation built from your own crops.",
      gapOther: n => `We have no data for ${n}; climate and water could not be assessed.`,
      gapSoil: "We do not know your soil type, so soil-related risks could not be assessed.",
      gapSell: "You did not pick any easy-to-sell crops, so the sellability score was not calculated.",
      gapEcocrop: n => `${n}: some FAO ECOCROP values have not been verified yet.`,
      gapFrost: n => `${n}: frost hardiness comes from the project team, not from ECOCROP.`,
      gapWater: n => `${n}: the FAO table has no water-need value.`,
      riskNew: n => `${n} was not in your rotation. Try it on a small plot first.`,
      riskRain: (n, r, min, water) => `${n}: the rain here (${r} mm) is below this crop's minimum need (${min} mm). ` + (water === "limited" ? "Limited irrigation may not cover the gap." : "Without irrigation it may not be enough."),
      riskMonths: (n, k) => `${n}: apart from the harvest month, ${k} of the months it is in the field look unsuitable for this crop.`,
      riskFamily: (a, b) => (a === b ? `${a} is grown back to back; diseases and pests can build up.` : `${a} and ${b} are from the same family and follow each other; diseases and pests can build up.`),
      riskBare: k => `The soil has no crop for ${k} months in a row. Consider a cover crop for this period.`,
      riskSteep: p => `Your field is steep and about ${p}% of the rain falls on bare soil; the risk of losing soil is high.`,
      riskSandy: "Sandy soil holds little water; without irrigation the drought risk is usually higher.",
      riskClay: "Clay soil is heavy and hard to work; sowing can be delayed in rainy periods.",
      riskFallowWater: "In dry areas, fallow stores water in the soil for the next crop. Replacing the fallow with a crop can leave less water for the crop that follows.",
      riskSeason: (n, mm, min) => `Only about ${mm} mm of rain falls here while ${n} is in the field; that is less than one third of the crop's minimum yearly need (${min} mm). Without irrigation this crop may struggle.`,
      draft: "Draft: the time the new crop in this option stays in the field has not been approved yet.",
      noneFound: "With these answers and the 20 crops on our list, our simple rules could not produce an alternative. That does not mean your rotation is the best possible.",
      oneFound: "With these answers, our simple rules could produce only one alternative.",
      emptyTitle: "Why are there fewer than three cards?",
      emptyMerged: names => `${names} suggested the same rotation; it is shown as one card.`,
      emptySoil: "Soil health: we found no legume that fits your rotation in this climate and raises the soil score.",
      emptySoilSingle: "Soil health: we found no legume that fits your empty period in this climate. Because your rotation has a single crop, we do not suggest replacing it.",
      emptyWater: "Water saving: we found no crop that could replace one of yours, suits the rain here better and fits the same period.",
      emptyMarket: "Market focused: among the crops you sell easily, we found none that fits your rotation in this climate and is not already in it.",
      emptyMarketSingle: "Market focused: among the crops you sell easily, we found none that fits your empty period in this climate. Because your rotation has a single crop, we do not suggest replacing it.",
      emptyMarketNoSell: "Market focused: this strategy did not run because you did not pick any easy-to-sell crops.",
      stripFallow: "Fallow: no crop for 12 months",
      stripBare: k => `${k} months with no crop`,
      expert: "Talk to a local agricultural adviser before you decide.",
      scienceHeads: [["Rules", ""], ["Data", "Month suitability and rain ranges"], ["Soil and pest rules", "Permanent soil cover"], ["Water and season", "The water score uses yearly rain"], ["Sowing time", "Sowing into the dry season:"], ["Soil sentences", "Soil sentences:"], ["What the model does not know", "The model does not account"]],
      futureScienceHeads: [["What is done", ""], ["Warming and water", ["Effect of warming on water:", "The data needed for the evaporation"]], ["The cards", "The rotations on the cards are chosen"], ["Soil directions", "Soil directions:"]],
      science: "The rules were set by the project team; this is not artificial intelligence or a crop growth model. Month suitability and rain ranges come from FAO ECOCROP (via the Recocrop package); climate comes from NASA POWER monthly averages for 2001–2024. Permanent soil cover and diversification with at least three different crops are FAO Conservation Agriculture principles. \"Do not grow crops of the same family back to back\" is a rule of thumb; some diseases also cross families. The amount of nitrogen fixed by legumes is not calculated. The water score uses yearly rain; the season is checked by a separate rule: without irrigation, if the rain that falls while a crop is in the field is less than one third of the crop's minimum yearly need, that crop is not suggested as an alternative, and if it is your own crop it is listed as a risk. In climates with wet winters, such as the Mediterranean, crops sown in spring also use the water stored in the soil over winter. Because the model does not calculate water stored in the soil, the threshold was deliberately kept loose (one third of the crop's minimum yearly need). The threshold was chosen by the team and was tested with the Konya and Jamaica examples. Sowing into the dry season: without irrigation, if less than 30 mm of rain falls in a crop's first two months in the field, the crop is not suggested as an alternative; if it is your own crop it is listed as a risk. Winter sowing: a crop can be placed with its winter duration only if it starts 2 to 4 months before the coldest month of that place (not in the month just before it); if the coldest month averages above 15°C, the place is treated as having no winter and no winter placement is made. The 30 mm, 2–4 months and 15°C thresholds were chosen by the team; they do not come from a source. The harvest month is not counted in the climate-fit score. Soil sentences: that sandy soil holds little water (available water: sand 25–100, clay 175–250 mm per metre) and that clay soil is heavy and hard to work come from FAO's irrigation training manual (Irrigation Water Management Training Manual No. 1, chapter \"Soil and water\"); that sowing can be delayed on clay soil is general farming knowledge. The model does not account for fallow storing water in the soil, stubble cover, differences between varieties, prices or yields."
    },
    allYear: "All year",
    planLabel: "Field plan",
    backToMap: "Back to map",
    calTitle: "Your field's year",
    calLegendRain: "Blue bar: average rain in that month (mm)",
    calLegendTemp: "Coloured box: average temperature (°C)",
    calLegendFrost: "❄ Frost risk",
    calScience: "Monthly averages for 2001–2024 from NASA POWER (T2M mean temperature, PRECTOTCORR precipitation, T2M_MIN lowest temperature of the month). A month counts as a frost risk if it dropped below 0°C in at least 20% of the years. NASA POWER works with cells of roughly 50 km, so this calendar describes your area, not your exact field. Averages hide the differences between years; a single year can be much wetter, drier or colder.",
    calTip: (m, temp, tmin, rain) => `${m}: ${temp}°C on average, lowest temperature of the month about ${tmin}°C, ${rain} mm of rain`,
    calLead: s => {
      const frost = s.frostAll ? "frost is possible in every month" : s.frost ? `frost is possible in ${s.frost}` : "there is no frost";
      return `In a typical year here, ${frost}, and the wettest months are ${s.wet}.`;
    },
    calYani: s => {
      const frost = s.frostAll ? "frost can strike in any month, so only frost-hardy crops are safe"
        : s.frost ? `frost-sensitive crops are usually safest in ${s.frostFree}`
        : "frost does not limit when you can plant";
      return `In plain words: ${frost}. ${s.wet} bring about ${s.wetMm} mm of rain (roughly ${s.share}% of the year's total), while ${s.dry} bring about ${s.dryMm} mm.`;
    },
    formTitle: "Tell us about your field",
    formLead: "Your answers stay on this device.",
    qRotation: "What do you grow now?",
    rotationHelp: "Add your crops in the order you grow them. Choose \"Fallow\" for an empty year and \"Other\" for a crop that is not on the list.",
    cropLabel: "Crop",
    sowLabel: "Sown in",
    harvestLabel: "Harvested in",
    cropChoose: "Choose a crop",
    monthChoose: "Month",
    addPeriod: "+ Add another crop",
    removePeriod: "Remove this crop",
    sameMonthWarn: "Sowing and harvest are in the same month. Is that right?",
    cropScience: "Crop data source: FAO ECOCROP (via the Recocrop package). This is a simplified model that shows tendencies. A month counts as suitable if its 2001–2024 mean temperature (NASA POWER) is within the range where the crop grows best, borderline if it is within the range the crop can tolerate, and not suitable if it is outside. Frost: where ECOCROP gives the crop's killing temperature, a month is not suitable if it dropped below that temperature in at least 20% of the years; where it does not, whether the crop is frost-hardy comes from the project team, not from ECOCROP. Winter pause: for crops the project team lists as suitable for winter sowing (wheat, barley, rye, canola, vetch, lentil), months that are too cold but not killing are not counted as unsuitable; the crop is assumed to wait in the cold. This information also comes from the team, not from ECOCROP. Winter-sown cereals harden in autumn and can then withstand lower temperatures; the single value in ECOCROP may not reflect this. That is why the team's information was used for winter crops. In very harsh winters the crop can still freeze; the model does not show this. Rain is compared as a yearly total, not month by month (ECOCROP rainfall values are annual). The model does not know about differences between varieties, your soil, or when you irrigate. NASA POWER works with cells of roughly 50 km, so it describes your area, not your exact field. Talk to a local agricultural adviser before deciding.",
    cropCalHead: "How each month's usual weather suits your crops",
    cropLegend: "✓ suitable · ~ borderline · z winter pause · ✕ not suitable · faded: months the crop is not in the field",
    cropStatus: { good: "suitable", edge: "borderline", wait: "winter pause (the crop waits in the cold)", bad: "not suitable" },
    cropCalTitle: (crop, sow, harvest) => `${crop}: sown in ${sow}, harvested in ${harvest}`,
    cropCalText: o => {
      const parts = [`${o.good} suitable`, `${o.edge} borderline`];
      if (o.wait) parts.push(`${o.wait} winter pause`);
      parts.push(`${o.bad} not suitable`);
      let s = `In plain words: for the ${o.n} ${o.n === 1 ? "month" : "months"} the crop is in the field, the rating is ${parts.join(", ")}.`;
      if (o.waitMonths) s += ` ${o.crop} pauses growth in the cold in ${o.waitMonths}; that is normal for a winter-sown crop.`;
      if (o.cold) s += ` ${o.cold}: too cold on average for this crop.`;
      if (o.hot) s += ` ${o.hot}: too hot on average for this crop.`;
      if (o.frost) s += ` ${o.frost}: a frost risk this crop is not expected to survive.`;
      if (o.bad > 0) s += o.windows.length
        ? ` A crop that stays ${o.n} months would avoid the unsuitable months if sown in ${o.windows.join(", ")}.`
        : ` No sowing month here keeps a ${o.n}-month crop out of unsuitable months.`;
      return s;
    },
    cropRainText: o => {
      let s = `Rain: this area gets about ${o.rain} mm a year. ${o.crop} needs at least ${o.rmin} mm; the ideal amount is ${o.ropmn}–${o.ropmx} mm.`;
      const low = o.level === "low" || o.level === "lowish";
      if (low && o.water === "irrigated") s += " In plain words: rain alone is low, but you irrigate, so it does not decide this.";
      else if (o.level === "low") s += o.water === "limited"
        ? " In plain words: rain alone is not enough, and limited irrigation may not cover the gap."
        : " In plain words: without irrigation, the rain here may not be enough for this crop.";
      else if (o.level === "lowish") s += " In plain words: rain is enough to grow it, but below the ideal amount.";
      else if (o.level === "ok") s += " In plain words: the yearly rain is in the ideal range for this crop.";
      else if (o.level === "highish") s += ` In plain words: rain is above the ideal amount, but below its upper limit of ${o.rmax} mm.`;
      else s += ` In plain words: that is more than its upper limit of ${o.rmax} mm; it may be too wet for this crop.`;
      if (!o.water && low) s += " (Answer the irrigation question below to refine this.)";
      return s;
    },
    rotationInfo: s => `As entered, this rotation repeats about every ${s.years} ${s.years === 1 ? "year" : "years"}, and the field has no crop for about ${s.bare} of those ${s.months} months.`,
    formErrorRotation: "Please add at least one crop, and pick the sowing and harvest month for every crop you add.",
    qSoil: "What is your soil like?",
    qWater: "Can you irrigate the field?",
    qSlope: "How steep is your field?",
    qPriorities: "How much does each of these matter to you?",
    prioHelp: "Set each slider: 1 = not important to me, 5 = very important.",
    prio: { water: "Saving water", soil: "Soil health", income: "Extra income" },
    // 5-minute field check (js/plan.js, FieldCheck). Step texts as given by the team; never enters the scoring.
    fcOpen: "Not sure? Do the 5-minute field check",
    fc: {
      title: "5-minute field check",
      step: (n, total) => `Step ${n} of ${total}`,
      heads: ["Soil texture", "Water holding (drainage)", "Slope", "Last year"],
      tasks: [
        "Take a handful of soil, wet it a little and knead it in your palm.",
        "One day after rain, are there still puddles in the field?",
        "Walk from one end of the field to the other. Do you feel a slope? When it rains, does water run one way and carry soil with it?",
        "Note last year briefly. These answers are only kept as a record; they do not enter the score."
      ],
      texture: {
        sandy: "It falls apart, will not form a ball, and feels gritty",
        loam: "It forms a ball, but a ribbon breaks at 2–3 cm",
        clay: "It makes a shiny ribbon longer than 5 cm between the fingers; sticky"
      },
      drain: { often: "Yes, often", sometimes: "Sometimes", no: "No" },
      drainNote: "The form has no matching question; your answer is only recorded and does not enter the score.",
      filled: (q, v) => `The "${q}" question in the form was set to "${v}". You can change it below if you like.`,
      lastCrop: "What was grown last year?",
      lastYield: "How was the yield?",
      yield: { good: "Good", mid: "Medium", poor: "Poor" },
      lastProblems: "Problems you had (pick as many as apply)",
      problems: { drought: "Drought", waterlog: "Waterlogging", pest: "Pests", disease: "Disease", none: "None" },
      back: "Back", next: "Next", finish: "Finish", close: "Close", again: "Start over",
      doneTitle: "Field check finished",
      doneEmpty: "You did not answer any step.",
      doneHint: "Your soil texture and slope answers filled in the questions below. The other answers are only a record; if you save a profile they appear in its \"Field check\" card.",
      note: "This is a field observation; for a definite result, have your soil tested.",
      source: "Method: FAO / USDA NRCS 'soil texture by feel'",
      rows: { texture: "Soil texture", drain: "Puddles a day after rain", slope: "Slope", lastCrop: "Grown last year", lastYield: "Last year's yield", problems: "Problems last year" },
      cardTitle: "Field check",
      cardNote: "These are your own field observations. The soil texture and slope answers fill in the form question; the others are only a record and do not enter the score."
    },
    opts: {
      soil: {
        sandy: ["Sandy", "Feels gritty and falls apart; water drains away fast."],
        loam: ["Loamy (in between)", "Soft and crumbly; forms a loose ball when squeezed."],
        clay: ["Clay", "Sticky when wet, hard and cracked when dry."],
        unknown: ["I don't know", "That's fine; we will show it as missing information."]
      },
      water: {
        irrigated: ["Irrigated", "I can water whenever the crop needs it."],
        limited: ["Limited water", "I can water a few times, but not through the whole season."],
        rainfed: ["Rain-fed", "No irrigation; the crop depends on rain."]
      },
      slope: {
        flat: ["Flat", "Rainwater does not run off."],
        gentle: ["Gently sloping", "Water runs off slowly in heavy rain."],
        steep: ["Steep", "Water runs off fast; soil washes away easily."]
      }
    },
    summaryLabels: { rotation: "Current rotation", soil: "Soil", water: "Water", slope: "Slope", sell: "Easy to sell" },
    continueBtn: "Continue",
    resetAnswers: "Reset answers",
    answersCleared: "Your answers were cleared.",
    formError: "Please answer the soil, water and slope questions.",
    summaryTitle: "Your answers",
    expertNote: "This tool supports your decision; it does not replace it. Talk to a local agricultural adviser before changing what you plant.",
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    yani: (r, t) => {
      const rain = Math.abs(r) < 3 ? "rain has barely changed" : `rain has ${r > 0 ? "risen" : "dropped"} by ${Math.abs(r)}%`;
      const temp = Math.abs(t) < 0.2 ? "temperature has barely changed" : `it has become ${fmt(Math.abs(t), 1)}°C ${t > 0 ? "warmer" : "cooler"} on average`;
      return `In plain words: compared with the early 2000s, ${rain} here and ${temp}.`;
    }
  }
};

const el = id => document.getElementById(id);

// Tarayıcı Türkçe ise Türkçe, değilse İngilizce açılır; dil seçicisinden değiştirilebilir
let LANG = (navigator.language || "en").toLowerCase().startsWith("tr") ? "tr" : "en";

function t(key) {
  return I18N[LANG][key];
}

function fmt(n, digits = 0) {
  return Number(n).toLocaleString(LANG === "tr" ? "tr-TR" : "en-US", {
    minimumFractionDigits: digits, maximumFractionDigits: digits
  });
}

function applyI18n() {
  document.documentElement.lang = LANG;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const val = I18N[LANG][el.dataset.i18n];
    if (typeof val === "string") el.textContent = val;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = I18N[LANG][el.dataset.i18nPlaceholder];
  });
}
