# 🚀 ZIPZIP — YAYINLAMA: BAŞTAN SONA TEK DOSYA

> **Sadece bu dosyayı takip et.** Yukarıdan aşağı, sırayla. Başka hiçbir dosyaya bakmana
> gerek yok — yapıştıracağın bütün metinler, bütün tıklamalar burada. 📋 işaretli kutular
> "olduğu gibi kopyala-yapıştır" demektir.
>
> Takıldığın HER yerde ekran görüntüsü at, anında yardım ederim.

---

## ❓ ÖNCE MERAK ETTİĞİN SORULARIN CEVABI

**"Codemagic'te bir şey yapmam gerekecek mi?"**
Evet ama sadece **2 basit şey**:
1. **(Bir kez)** App Store'a yükleme anahtarını eklemek → `BÖLÜM 4`
2. **(Her yayında)** "Start new build" deyip doğru workflow'u seçmek → `BÖLÜM 5`

Gerisini Codemagic **kendisi** yapıyor: reklam kütüphanesini kuruyor, uygulamayı imzalıyor,
TestFlight'a otomatik yüklüyor. Sen sadece bu ikisini yapacaksın.

**"Görselleri (ekran görüntüleri) nereden bulacağım?"**
Hepsi bilgisayarında hazır, şu klasörde:
`C:\Users\cllak\OneDrive\Desktop\zipzip-platform\store-assets\`
10 dosya var (5 sahne × 2 boyut). `BÖLÜM 7` bunları nereye yükleyeceğini anlatıyor.

**"Ne kadar sürer?"**
Kurulum ~40 dk senin işin. Sonra Apple incelemesi 24–48 saat (onu Apple yapar, sen beklersin).

**"Para?"** Apple üyeliğin var (yıllık $99). Başka masraf yok. Oyun ücretsiz, reklamdan kazanırsın.

---

## 🗺️ YOL HARİTASI (ne yapacağız)

```
BÖLÜM 1  Apple'da kimlik oluştur (Bundle ID)          ~5 dk
BÖLÜM 2  App Store Connect'te uygulamayı aç           ~5 dk
BÖLÜM 3  Yükleme anahtarı üret (API key)              ~5 dk
BÖLÜM 4  Anahtarı Codemagic'e bağla  [CODEMAGIC #1]   ~3 dk
BÖLÜM 5  İmzalı derleme başlat        [CODEMAGIC #2]  ~20 dk (bekleme)
BÖLÜM 6  Telefonda test et (TestFlight)               ~15 dk
BÖLÜM 7  Mağaza sayfasını doldur (metin+görsel)       ~20 dk
BÖLÜM 8  Yaş sınırı + gizlilik anketi                 ~10 dk
BÖLÜM 9  Fiyat + İNCELEMEYE GÖNDER  🎉                ~2 dk
BÖLÜM 10 Onaydan sonra                                 —
```

Şu an her şey hazır: oyun yayın halinde (piksel görseller), reklamlar gerçek moda alındı,
gizlilik sayfası internette, ekran görüntüleri üretildi, derleme hattı kuruldu. Başlayalım.

---

# BÖLÜM 1 — Apple'da kimlik oluştur (Bundle ID)

1. Tarayıcıda **developer.apple.com** aç → sağ üst **Account** → Apple ID'nle giriş.
2. **Certificates, Identifiers & Profiles**'a tıkla → sol menü **Identifiers** → mavi **+**.
3. **App IDs** → Continue → **App** → Continue.
4. Şunları doldur:
   - **Description:** `ZIPZIP`
   - **Bundle ID:** **Explicit** seçeneğini işaretle, kutuya harf harf şunu yaz:

   📋 `com.zipzip.game`

   > ⚠️ Bu en kritik yazım. Bir harf bile farklı olursa imzalama tutmaz. Nokta dahil aynen.
5. Aşağıdaki Capabilities listesinde **hiçbir şeyi işaretleme** → **Continue** → **Register**.

✅ Bitti. Bir sonraki bölüme geç.

---

# BÖLÜM 2 — App Store Connect'te uygulamayı aç

1. **appstoreconnect.apple.com** → giriş → **Apps (Uygulamalarım)** → mavi **+** → **New App**.
2. Şunları doldur:
   - **Platforms:** ☑ iOS
   - **Name:**

     📋 `ZIPZIP`

     > İsim alınmışsa şunu dene: `ZipZip: Kızı Kurtar`
   - **Primary Language:** Turkish (Türkçe)
   - **Bundle ID:** açılır listeden **com.zipzip.game** seç (Bölüm 1'de oluşturduğun)
   - **SKU:** (kendi iç kodun, önemli değil)

     📋 `zipzip-001`
   - **User Access:** Full Access
3. **Create** butonuna bas.

✅ Uygulaman oluştu. Şimdi Apple'ın Codemagic'i tanıması için anahtar üreteceğiz.

---

# BÖLÜM 3 — Yükleme anahtarı üret (API key)

Bu anahtar, Codemagic'in senin adına Apple'a uygulama yüklemesini sağlar.

1. App Store Connect'te üst menüden **Users and Access**'e tıkla.
2. **Integrations** sekmesi → sol taraftan **App Store Connect API** → **Team Keys**.
3. **+** (Generate API Key / Add) butonu.
   - **Name:**

     📋 `codemagic`
   - **Access:** açılır menüden **App Manager** seç.
4. **Generate** bas.
5. Şimdi ÜÇ bilgiyi bir yere not et (Not Defteri aç, kaydet):
   - **Issuer ID** → sayfanın üstünde, uzun bir kod (örn. `69a6de70-...`)
   - **Key ID** → yeni oluşan anahtarın satırında (örn. `2X9ABC3DEF`)
   - **Download** linkine tıkla → **`.p8`** uzantılı dosya iner.

   > ⚠️⚠️ Bu `.p8` dosyası **hayatta yalnızca 1 KEZ** indirilebilir! İner inmez
   > güvenli bir klasöre kaydet (örn. Masaüstünde "zipzip-anahtar" klasörü). Kaybedersen
   > yenisini üretmen gerekir.

✅ Elinde 3 şey var: Issuer ID, Key ID, `.p8` dosyası. Sıra Codemagic'te.

---

# BÖLÜM 4 — Anahtarı Codemagic'e bağla  🔧 [CODEMAGIC İŞİ #1]

1. **codemagic.io** → giriş yap.
2. Sol alttaki hesap adına (**Personal Account**) tıkla → **Integrations**
   (bulamazsan: **Teams → Personal Account → Integrations**).
3. **Developer Portal** ya da **App Store Connect** başlığını bul → **Manage keys** / **Add key**.
4. Açılan formu doldur:
   - **App Store Connect API key name:** buraya AYNEN şunu yaz:

     📋 `zipzip-asc`

     > ⚠️ Bu isim çok önemli! Derleme hattım tam olarak bu ismi arıyor. Büyük harf yok,
     > boşluk yok, tırnak yok. `zipzip-asc`
   - **Issuer ID:** Bölüm 3'te not ettiğin
   - **Key ID:** Bölüm 3'te not ettiğin
   - **API key (.p8):** Bölüm 3'te indirdiğin `.p8` dosyasını seç/yükle
5. **Save** bas.

✅ Codemagic artık senin adına Apple'a yükleme yapabilir. Bir daha bu bölümü yapmayacaksın.

---

# BÖLÜM 5 — İmzalı derleme başlat  🔧 [CODEMAGIC İŞİ #2]

1. Codemagic → **zipzip-platform** uygulaman → sağ üstte **Start new build**.
2. Açılan pencerede:
   - **Branch:** `master`
   - **Workflow:** **`ZIPZIP iOS Release`** seç
     > ⚠️ "ZIPZIP iOS" (eski, imzasız test) DEĞİL! Sonu **Release** olanı seç.
3. **Start new build** bas.
4. ~15–25 dakika sürer. Kahveni al ☕. Sonuç:

   - 🟢 **YEŞİL:** İmzalı .ipa derlendi VE TestFlight'a otomatik yüklendi! → Bölüm 6'ya geç.
   - 🔴 **KIRMIZI:** Panik yok. Kırmızı olan adıma tıkla → açılan siyah logun **en altına** in →
     içinde kırmızı **`error:`** geçen satırların **ekran görüntüsünü bana at**. Çözüm planım hazır
     (tek olası risk reklam kütüphanesinin derlenmesi, onu da hallederiz).

✅ Yeşil aldıysan: uygulaman Apple'a yüklendi. Şimdi telefonunda test edeceğiz.

---

# BÖLÜM 6 — Telefonda test et (TestFlight)

1. App Store Connect → uygulaman → üstten **TestFlight** sekmesi.
2. Build'in önce **"Processing"** (işleniyor) görünür — **10–30 dk** bekle, sayfayı yenile.
3. Build hazır olunca "Missing Compliance" (şifreleme uyumu) uyarısı çıkabilir:
   - Build'e tıkla → şifreleme sorusunda **"None of the algorithms..."** / **Hayır** de.
   - (Normalde otomatik geçer; çıkarsa böyle cevapla, oyun şifreleme kullanmıyor.)
4. **Internal Testing** (sol menü) → **+** ile grup oluştur → kendini ekle
   (Apple ID e-postanı **App Store Connect Users** kısmından ekli olmalı — genelde zaten eklisin).
5. **iPhone'una** App Store'dan **TestFlight** uygulamasını indir.
6. E-postana gelen **davet linkine** tıkla (ya da TestFlight uygulamasında görünür) → **ZIPZIP'i kur** → **OYNA!** 🎮

### ⚠️ TEST EDERKEN ÇOK ÖNEMLİ İKİ ŞEY
- **Reklamlar artık GERÇEK.** Öldükten sonra "REKLAM İZLE & DEVAM"a basıp reklamı izleyebilirsin
  ama **ASLA reklamın üstüne TIKLAMA!** Kendi reklamına tıklamak AdMob hesabını yasaklatabilir.
  (İzlemek/kapatmak serbest, tıklamak yasak.)
- İlk açılışta **"ZIPZIP'in etkinliğini izlemesine izin ver?"** sorusu çıkar — bu normaldir
  (reklam izni). İstediğini seçebilirsin, oyun her türlü çalışır.

> Not: Yeni AdMob uygulamalarında ilk günlerde reklam gelmeyebilir ("no fill"). Sorun değil —
> oyun o durumda seni yine de devam ettirir. Reklamlar mağaza onayından sonra tam oturur.

✅ Oyun telefonunda çalışıyorsa harika! Son adım: mağaza sayfasını doldurup incelemeye göndermek.

---

# BÖLÜM 7 — Mağaza sayfasını doldur (metin + görsel)

App Store Connect → uygulaman → sol menüde sürüm başlığına (**1.0 Prepare for Submission**) tıkla.
Aşağıdaki alanları doldur. Metinleri 📋 kutularından kopyala.

## 7.1 — Ekran görüntüleri (görseller)
Bilgisayarında şu klasörü aç: `Masaüstü\zipzip-platform\store-assets\`

- **iPhone 6.9" Display** kutusuna şu 5 dosyayı sürükle-bırak (bu sırayla):
  `iphone69-1-macera.jpg`, `iphone69-2-boss.jpg`, `iphone69-3-biyomlar.jpg`,
  `iphone69-4-canavarlar.jpg`, `iphone69-5-kovalama.jpg`
- **iPhone 6.5" Display** kutusuna aynı sırayla `iphone65-*.jpg` dosyalarını sürükle.
- (Başka boyut sorarsa: 6.9" görselleri o kutuya da yükleyebilirsin, Apple ölçekler.)

## 7.2 — Promotional Text (Promosyon metni)
📋
```
Gölgehan kızı kaçırdı! 100 bölüm, 8 dünya ve dev boss savaşlarıyla dolu bu piksel macerada peşine düş. Tamamen ücretsiz, internetsiz de oynanır!
```

## 7.3 — Description (Açıklama)
📋
```
GÖLGEHAN KIZI KAÇIRDI! PEŞİNE DÜŞ VE KIZI KURTAR!

ZIPZIP, ters kasketli kahramanımızın kötü büyücü Gölgehan'ı 8 farklı dünyada kovaladığı, el yapımı piksel grafikli bir platform oyunudur. Koş, zıpla, canavarları ez ve her bölümün sonunda Gölgehan'a biraz daha yaklaş!

ÖZELLİKLER

• 100 BENZERSİZ BÖLÜM — Her bölüm farklı tasarlandı; kolay başlar, ustalık ister.
• 8 FARKLI DÜNYA — Çayırlardan ormanlara, çölden buz ülkesine, yeraltından yanardağa!
• DEV BOSS SAVAŞLARI — Her dünyanın sonunda Gölgehan'la yüzleş: mermilerinden kaç, kafasına zıpla!
• 15 KOSTÜM — Korsan, robot, büyücü, pelerinli kahraman ve daha fazlası. Coin topla, dükkandan kuşan!
• 6 SÜPER GÜÇ — Kalkan, dev büyüme, süper zıplama, hız, mıknatıs ve çift zıplama!
• KALICI GÜÇLER — Dükkandan kalıcı yükseltmeler al: başlangıç kalkanı, çift coin ve daha fazlası.
• KOLAY KONTROLLER — Üç buton yeter: sola, sağa, zıpla. Her yaş için uygun!

NEDEN ZIPZIP?

✓ Tamamen ÜCRETSİZ — zorunlu satın alma yok
✓ İNTERNETSİZ oynanır — uçakta, yolda, her yerde
✓ Hesap, kayıt, e-posta GEREKMEZ
✓ İlerlemen otomatik kaydedilir
✓ Reklamlar tamamen İSTEĞE BAĞLI (sadece öldüğün yerden devam etmek istersen)

Kız seni bekliyor. Gölgehan kaçmaya devam ediyor. HAYDİ ZIPZIP, GÖREV BAŞINA!
```

## 7.4 — Keywords (Anahtar kelimeler)
📋
```
platform,zıplama,macera,piksel,retro,koşu,boss,kostüm,çocuk,eğlenceli,arcade,2d
```

## 7.5 — Alt başlık (Subtitle) — sorarsa
📋
```
Koş, zıpla, kızı kurtar!
```

## 7.6 — URL'ler
- **Support URL:** 📋 `https://cllakkus.github.io/zipzip-platform/`
- **Marketing URL** (isteğe bağlı): 📋 `https://cllakkus.github.io/zipzip-platform/`

## 7.7 — Diğer alanlar
- **Version:** `1.0.0`
- **Copyright:** 📋 `© 2026 Celal Akkus`
- **Build:** "+" işaretine bas → TestFlight'taki build'i seç (Bölüm 6'da yüklenen).
- **App Review Information** (Apple'ın incelemecisi için): ad-soyad, e-posta, telefon numaran.
  **Notes** kutusuna:
  📋
  ```
  Temel oyun cevrimdisi calisir. Hesap/giris ve satin alma yoktur. Oyuncu isterse oldugu yerden devam etmek icin Google AdMob odullu reklam izleyebilir.
  ```

✅ Kaydet (sağ üst **Save**). Devam.

---

# BÖLÜM 8 — Yaş sınırı + gizlilik anketi

## 8.1 — App Information (Kategori)
Sol menü **App Information**:
- **Category → Primary:** Games
- **Secondary** (varsa): Action ve/veya Adventure
- **Content Rights:** "Üçüncü taraf içerik içeriyor mu?" → **Yes** (Google AdMob reklamları);
  AdMob kullanım koşulları kapsamında gösterim hakkın vardır.

## 8.2 — Age Rating (Yaş sınırı)
**App Information** içinde **Age Rating → Edit** → anketi doldur:
- **"Cartoon or Fantasy Violence"** → **Infrequent/Mild** (düşman ezmece var, hafif)
- **Diğer TÜM sorular** → **None**
- Gambling / Contests → None · Unrestricted Web Access → **No**
- Sonuç **9+** çıkacak → **Done**.

## 8.3 — App Privacy (Gizlilik anketi)
> 📌 v1.0 isteğe bağlı Google AdMob ödüllü reklamları içerir. Apple, uygulamaya eklenen
> üçüncü taraf SDK'ların veri kullanımının da açıklanmasını ister.

Sol menü **App Privacy** → **Get Started** / **Edit**:
1. **Privacy Policy URL:** 📋 `https://cllakkus.github.io/zipzip-platform/privacy.html`
2. "Do you or your partners collect data from this app?" → **Yes, we collect data**
3. Google Mobile Ads açıklamasına göre en az şu türleri işaretle: **Coarse Location, Device ID,
   Advertising Data, Product Interaction, Performance Data, Crash Data**. Kullanım amaçlarını
   App Store Connect'teki güncel seçeneklerle eşleştirirken Google'ın veri açıklama sayfasını esas al.
4. **Publish** / **Save**.

✅ Anket bitti. Son adım!

---

# BÖLÜM 9 — Fiyat + İNCELEMEYE GÖNDER 🎉

1. Sol menü **Pricing and Availability**:
   - **Price:** **Free** (0 / Ücretsiz)
   - **Availability:** tüm ülkeler (varsayılan) → Save.
2. Sol menüde sürüm sayfasına (**1.0 Prepare for Submission**) dön.
3. Sağ üstte **Add for Review** → sonra **Submit to App Review** bas.
4. 🎉 Gönderildi! Artık Apple inceliyor.
   - İnceleme genelde **24–48 saat** (bazen daha hızlı).
   - Sonuç e-postayla gelir:
     - ✅ **Approved / Ready for Sale** → Oyun App Store'da YAYINDA! Herkes indirebilir! 🏆
     - ❌ **Rejected** → Üzülme, ilk gönderimde çok olur. Red mesajının ekran görüntüsünü
       bana at, birlikte düzeltip 1 tıkla yeniden göndeririz.

---

# BÖLÜM 10 — Onaydan sonra (yayına girince)

1. **AdMob paneli** → Uygulamalar → ZIPZIP → uygulamayı **App Store kaydıyla eşle**
   (mağazada arayıp bağla). Bu, reklam gelirini ve dolumu netleştirir.
2. Apple ya da AdMob **`app-ads.txt`** isterse → bana söyle, GitHub'a 1 dakikada eklerim.
3. Oyunun linkini arkadaşlarına yolla, ilk yıldızları/yorumları topla ⭐
4. Güncelleme yapmak istediğinde: bana söyle → değişikliği yaparım → sen Codemagic'te
   yine **ZIPZIP iOS Release** build'i başlatır, App Store'da yeni sürümü **Submit** edersin.

---

# 🆘 SIK TAKILINAN YERLER (hızlı çözüm)

| Belirti | Çözüm |
|---|---|
| Codemagic: "integration zipzip-asc not found" | Bölüm 4'te anahtar adı birebir `zipzip-asc` değil. Düzelt. |
| "No matching profiles found ... com.zipzip.game" | Çözüldü (imzalama artık profili otomatik üretiyor). Push + build'i tekrar başlat. Yine olursa: API anahtarını **Admin** yetkisiyle yeniden üret (Bölüm 3). |
| Release build 🔴, logda AdMob/Swift hatası | `error:` satırlarının ekran görüntüsünü bana at. |
| Build "ZIPZIP iOS" seçtim, imzasız çıktı | Yanlış workflow. **ZIPZIP iOS Release** (sonu Release) seç. |
| TestFlight'ta build yok | 10–30 dk "Processing" sürer; e-postana uyarı geldi mi bak. |
| "Missing Compliance" uyarısı | Build'e tıkla → şifreleme yok / "None of the algorithms" de. |
| İsim "ZIPZIP" alınmış | `ZipZip: Kızı Kurtar` dene (Bölüm 2). |
| Reklam gelmiyor (TestFlight) | Yeni AdMob'da 1-2 gün sürebilir; oyun reklamsız da devam ettirir, engel değil. |
| `.p8` dosyasını kaybettim | Bölüm 3'ü tekrarla, yeni anahtar üret (eskisini App Store Connect'te sil). |

---

# ✅ KONTROL LİSTESİ (işaretleyerek ilerle)

- [ ] Bölüm 1: Bundle ID `com.zipzip.game` kaydedildi
- [ ] Bölüm 2: App Store Connect'te ZIPZIP oluşturuldu
- [ ] Bölüm 3: Issuer ID + Key ID not edildi, `.p8` kaydedildi
- [ ] Bölüm 4: Codemagic'e `zipzip-asc` adıyla anahtar eklendi
- [ ] Bölüm 5: ZIPZIP iOS Release build 🟢 yeşil
- [ ] Bölüm 6: Oyun iPhone'da TestFlight'tan oynandı
- [ ] Bölüm 7: Görseller + metinler girildi
- [ ] Bölüm 8: Yaş sınırı + gizlilik anketi tamam
- [ ] Bölüm 9: İncelemeye gönderildi
- [ ] Bölüm 10: Apple onayı geldi → 🎉 YAYINDA!

---

**Kısacası:** Bu dosyayı aç, Bölüm 1'den başla, her 📋 kutusunu kopyala-yapıştır yap,
Codemagic'te sadece 2 şeyi (anahtar + build) yap. Takılırsan ekran görüntüsü at. Hepsi bu!
Oyunun App Store'a birkaç gün uzaklıkta. Kolay gelsin dostum. 🚀
