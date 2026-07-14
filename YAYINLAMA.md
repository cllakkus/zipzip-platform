# ZIPZIP — App Store YAYINLAMA REHBERİ (adım adım)

> Apple Developer üyeliğin AKTİF ✅ — bu rehber seni sıfırdan "App Store'da yayında"ya götürür.
> Sıra önemli: adımları yukarıdan aşağı uygula. Metinler için `APPSTORE-METIN.md`,
> görseller için `store-assets/` klasörü hazır. Takıldığın her yerde ekran görüntüsünü asistana at.

---

## ✅ HAZIR OLANLAR (senin bir şey yapman gerekmiyor)
- Oyun yayın halinde (piksel görsel yenileme dahil), `AD_TESTING=false` (gerçek reklamlar)
- İmzalı derleme hattı: `codemagic.yaml` → **ZIPZIP iOS Release** (AdMob'u kendisi kurar,
  Info.plist'i kendisi ayarlar, TestFlight'a kendisi yükler)
- Ekran görüntüleri: `store-assets/` (iPhone 6.9" ve 6.5", 5'er adet)
- Gizlilik politikası: https://cllakkus.github.io/zipzip-platform/privacy.html
- Uygulama ikonu: `resources/icon.png` (mağaza kaydında da kullanılır)
- Tüm mağaza metinleri: `APPSTORE-METIN.md`

---

## ADIM 1 — Bundle ID kaydet (5 dk, bir kez)
1. Tarayıcıda **developer.apple.com** → sağ üst **Account** → giriş yap.
2. **Certificates, Identifiers & Profiles** → sol menü **Identifiers** → **+** (mavi artı).
3. **App IDs** → Continue → **App** → Continue.
4. Doldur:
   - **Description:** `ZIPZIP`
   - **Bundle ID:** **Explicit** seç, kutuya AYNEN: `com.zipzip.game`
5. Capabilities listesinde HİÇBİR ŞEY işaretleme → **Continue** → **Register**.

## ADIM 2 — App Store Connect'te uygulamayı oluştur (5 dk)
1. **appstoreconnect.apple.com** → giriş → **My Apps (Uygulamalarım)** → **+** → **New App**.
2. Doldur:
   - **Platforms:** iOS
   - **Name:** `ZIPZIP`  (alınmışsa: `ZIPZIP!` veya `ZipZip: Kızı Kurtar`)
   - **Primary Language:** Turkish
   - **Bundle ID:** listeden `com.zipzip.game` seç (Adım 1'de kaydettiğin)
   - **SKU:** `zipzip-001` (görünmez, dahili kod)
   - **User Access:** Full Access
3. **Create**.

## ADIM 3 — API anahtarı üret (Codemagic'in Apple'a yükleme yapabilmesi için, 5 dk)
1. App Store Connect → üst menü **Users and Access** → **Integrations** sekmesi →
   **App Store Connect API** → **Team Keys** → **+** (Generate API Key).
2. **Name:** `codemagic` · **Access:** **App Manager** → Generate.
3. Şu ÜÇ şeyi kaydet (bir dosyaya not et):
   - **Issuer ID** (sayfanın üstünde, uzun kod)
   - **Key ID** (anahtarın satırında)
   - **Download API Key** → `.p8` dosyasını indir. ⚠️ SADECE 1 KEZ indirilebilir — sakla!

## ADIM 4 — Anahtarı Codemagic'e bağla (3 dk, bir kez)
1. **codemagic.io** → giriş → sol altta **Personal Account** → **Integrations** (veya
   Teams → Personal Account → Integrations).
2. **Developer Portal / App Store Connect** bölümünde **Add key** (Manage keys).
3. Doldur:
   - **App Store Connect API key name:** AYNEN `zipzip-asc`  ⚠️ (codemagic.yaml bu adı arar!)
   - **Issuer ID** ve **Key ID:** Adım 3'te not ettiklerin
   - **API key:** indirdiğin `.p8` dosyasını yükle
4. **Save**.

## ADIM 4B — İmzalama kimliklerini Codemagic'e ekle (bir kez)
1. **Personal Account → codemagic.yaml settings → Code signing identities**.
2. **iOS certificates** altında özel anahtarıyla birlikte geçerli bir **Apple Distribution**
   sertifikası bulunmalı. Yoksa **Generate certificate** ile oluştur ve arayüz isterse oluşan
   `.p12` dosyasını verilen parolayla geri yükle.
3. **iOS provisioning profiles → Fetch profiles** altında `com.zipzip.game` için **App Store**
   profilini ekle. Profil yoksa Apple Developer Portal → **Profiles → + → App Store Connect**
   yoluyla oluşturup Codemagic'e dönerek tekrar getir.
4. Profilin sertifika eşleşmesi yeşil görünmeden build başlatma. `.p8` dosyası tek başına
   uygulamayı imzalamaz; yalnızca Apple API erişimini sağlar.

## ADIM 5 — İmzalı derleme + TestFlight yüklemesi (tek tık)
1. GitHub Desktop → **Push origin** (bekleyen tüm commit'ler gitsin).
2. Codemagic → zipzip-platform → **Start new build** → **Workflow: ZIPZIP iOS Release** → Start.
3. ~15–25 dk sürer. 🟢 Yeşil = .ipa derlendi VE TestFlight'a otomatik yüklendi.
   - 🔴 Kırmızı olursa: kırmızı adıma tıkla → logun sonundaki `error:` satırlarının
     ekran görüntüsünü asistana at.

## ADIM 6 — Telefonunda test et (TestFlight)
1. App Store Connect → uygulaman → **TestFlight** sekmesi. Build önce "Processing"
   görünür (10–30 dk bekle).
2. İlk build'de "Missing Compliance" uyarısı çıkarsa: build'e tıkla → şifreleme sorusuna
   **None of the algorithms mentioned above** / hayır de (oyun şifreleme kullanmıyor).
   (Normalde `ITSAppUsesNonExemptEncryption=false` bunu otomatik geçer.)
3. **Internal Testing** → **+** ile grup oluştur → kendini (Apple ID e-postan) ekle.
4. iPhone'una App Store'dan **TestFlight** uygulamasını indir → e-postana gelen davete
   tıkla → ZIPZIP'i kur → OYNA! 🎮
5. ⚠️ **REKLAM UYARISI:** Reklamlar artık GERÇEK. Test ederken reklamı izleyip kapat,
   ama **ASLA TIKLAMA** — kendi reklamına tıklamak AdMob hesabını yasaklatabilir.
6. İlk açılışta "izlemene izin ver?" sorusu çıkar — bu normal (reklam izni), ikisi de seçilebilir.

## ADIM 7 — Mağaza sayfasını doldur (20 dk)
App Store Connect → uygulaman → sol menü **1.0 Prepare for Submission**:

1. **Ekran görüntüleri:** "iPhone 6.9-inch Display"e `store-assets/iphone69-*.jpg` (5 dosya),
   "6.5-inch"e `iphone65-*.jpg` sürükle-bırak. (Sıra: 1-macera, 2-boss, 3-biyomlar,
   4-canavarlar, 5-kovalama.)
2. **Promotional Text / Description / Keywords:** `APPSTORE-METIN.md`'den kopyala-yapıştır.
3. **Support URL:** `https://cllakkus.github.io/zipzip-platform/`
4. **Marketing URL:** (isteğe bağlı) aynısı.
5. **Version:** `1.0.0` · **Copyright:** `© 2026 Celal Akkus`
6. **Build:** + işaretine bas → TestFlight'taki build'i seç.
7. **App Review Information:** ad-soyad, e-posta, telefon. **Notes** kutusuna:
   `Cevrimdisi platform oyunu. Hesap gerekmez. Olunce devam etmek icin istege bagli
   AdMob odullu reklam gosterir.`

## ADIM 8 — App Information + yaş sınırı
Sol menü **App Information**:
- **Category:** Games → Secondary: **Action** ve **Adventure**
- **Content Rights:** üçüncü taraf içerik sorusuna **Yes** (reklamlar üçüncü taraf içeriktir).

**Age Rating** → Edit → anketi doldur:
- "Cartoon or Fantasy Violence" → **Infrequent/Mild** (düşman ezmece var) — diğer HER ŞEY → **None**
- Gambling/Contests → None · Unrestricted Web Access → No
- Sonuç **9+** çıkar → Done. (Reklamlı oyunlar için normaldir.)

## ADIM 9 — App Privacy (gizlilik anketi — AdMob yüzünden ÖNEMLİ)
Sol menü **App Privacy** → **Get Started**:
1. **Privacy Policy URL:** `https://cllakkus.github.io/zipzip-platform/privacy.html`
2. "Do you collect data?" → **Yes, we collect data from this app**
3. Veri türlerinde ŞU İKİSİNİ işaretle (başka hiçbir şey işaretleme):
   - **Identifiers → Device ID**
   - **Usage Data → Advertising Data**
4. Her ikisi için sorulara şöyle cevap ver:
   - Kullanım amacı: **Third-Party Advertising**
   - "Linked to the user's identity?" → **No** (kimliğe bağlanmıyor)
   - "Used for tracking?" → **Yes** (ATT izni bu yüzden isteniyor)
5. **Publish**.

## ADIM 10 — Fiyat + yayınla
1. Sol menü **Pricing and Availability** → Price: **Free (0)** → tüm ülkeler.
2. "Prepare for Submission" sayfasının başına dön → **Add for Review** → **Submit to App Review**.
3. İnceleme genelde **24–48 saat**. Sonuç e-postayla gelir:
   - ✅ **Approved** → oyun App Store'da YAYINDA! 🎉
   - ❌ **Rejected** → red mesajının ekran görüntüsünü asistana at; birlikte düzeltip
     yeniden göndeririz (ilk denemede red, yeni geliştiricilerde çok normaldir).

---

## 📌 Sık takılınan yerler
| Belirti | Çözüm |
|---|---|
| Codemagic "integration zipzip-asc not found" | Adım 4'te anahtar adı birebir `zipzip-asc` değil — düzelt |
| Release build kırmızı, logda AdMob/Swift hatası | `error:` satırlarını asistana gönder |
| TestFlight'ta build görünmüyor | 10–30 dk "Processing" sürer; e-postana uyarı gelmiş mi bak |
| "Missing Compliance" | Build'e tıkla → şifreleme yok de |
| İsim "ZIPZIP" alınmış | `ZIPZIP!` veya `ZipZip: Kızı Kurtar` dene (Adım 2) |
| Reklam çıkmıyor (TestFlight) | Yeni AdMob uygulamalarında dolum saatler/1-2 gün sürebilir; oyun reklamsız da devam ettirir — engel değil |

## 🚀 Yayından SONRA yapılacaklar
1. AdMob paneli → Uygulamalar → ZIPZIP → **mağaza kaydıyla eşle** (App Store'da yayına
   girince arayıp bağla) → reklam dolumu ve ödemeler netleşir.
2. `app-ads.txt` sorarsa: asistana söyle, GitHub Pages'e ekleriz.
3. Oyunu arkadaşlarına yolla, ilk yorumları topla! ⭐
