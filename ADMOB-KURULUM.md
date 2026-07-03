# AdMob Hesabı Açma — Adım Adım (ZIPZIP)

> Bu rehber SADECE hesabın açılması ve uygulamanın kaydedilmesi içindir.
> Kod entegrasyonu (placeholder reklamın gerçeğiyle değiştirilmesi) daha sonra
> asistanla birlikte yapılacak — o aşamada senden sadece bu rehberin sonunda
> not edeceğin ID'ler istenecek.

## Gerekenler
- Bir Google hesabı (Gmail). Varsa mevcut hesabın kullanılabilir.
- 18 yaşından büyük olmak.
- Ödeme alabilmek için (ileride) banka hesabı — hesap açarken ŞART DEĞİL.

## ADIM 1 — Hesabı aç (≈5 dakika)
1. Tarayıcıda **admob.google.com** adresine git.
2. Sağ üstteki **"Başlayın"** (Get started) düğmesine tıkla.
3. Google hesabınla giriş yap.
4. Sorulara şöyle cevap ver:
   - **Ülke/bölge:** Türkiye
   - **Saat dilimi:** (GMT+03:00) İstanbul
   - **Fatura para birimi:** TRY (sonradan değiştirilemez, dikkat!)
5. AdMob **şartlarını kabul et** kutusunu işaretle → **AdMob hesabı oluştur**.
6. E-postana gelen doğrulama varsa onayla. "Hesabınız hazırlanıyor" ekranı
   birkaç dakika sürebilir — normal.
7. Açılan panelde sana birkaç soru sorabilir (e-posta tercihleri vb.) —
   istediğin gibi işaretle, önemli değil.

## ADIM 2 — Uygulamayı kaydet (≈3 dakika)
1. Sol menüden **Uygulamalar** (Apps) → **Uygulama ekle** (Add app).
2. **"Uygulama bir uygulama mağazasında yayında mı?"** → **HAYIR** seç
   (oyun henüz App Store'da değil; yayınlanınca mağaza kaydıyla eşlenir).
3. **Platform:** iOS
4. **Uygulama adı:** ZIPZIP
5. **Ekle**'ye bas. 🎉 Uygulama oluştu.
6. Ekranda görünen **Uygulama Kimliği'ni (App ID)** not al. Şuna benzer:
   `ca-app-pub-1234567890123456~1234567890`
   (sondaki `~` işaretli kısım dahil hepsini kopyala.)

## ADIM 3 — Ödüllü reklam birimi oluştur (≈2 dakika)
1. Sol menü → **Uygulamalar** → ZIPZIP → **Reklam birimleri** (Ad units).
2. **Reklam birimi ekle** → **Ödüllü** (Rewarded) türünü seç.
   (ZIPZIP'te reklam, "öldüğün yerden devam" ödülü verir — tam bu tür.)
3. **Reklam birimi adı:** `devam-odul` (ya da istediğin bir ad)
4. Ödül ayarları: **Miktar 1, Öğe "devam"** yaz (sadece etiket, önemi yok).
5. **Reklam birimi oluştur** → çıkan **Reklam Birimi Kimliğini** not al:
   `ca-app-pub-1234567890123456/0987654321`
   (bu seferki `/` işaretli olandır.)

## ADIM 4 — Android için tekrarla (İSTEĞE BAĞLI)
Oyun Android'e de çıkacaksa Adım 2–3'ü **Platform: Android** seçerek tekrarla.
iOS ve Android için ID'ler AYRI olur.

## Not alacakların (asistana verilecek)
| Ne | Örnek biçim |
|---|---|
| iOS App ID | `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY` |
| iOS Ödüllü Reklam Birimi ID | `ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ` |
| (varsa) Android App ID | `ca-app-pub-…~…` |
| (varsa) Android Ödüllü ID | `ca-app-pub-…/…` |

## Sık sorulanlar
- **Para ödemem gerekiyor mu?** Hayır, AdMob tamamen ücretsizdir; sana öder.
- **Banka bilgisi ne zaman?** Kazanç eşiği geçilince (≈100 $) panel ister; şart değil.
- **"Hesap inceleniyor" diyor.** Yeni hesaplarda normaldir, birkaç gün sürebilir.
  İnceleme bitmeden test reklamlarıyla geliştirme yapılabilir.
- **App Store'a çıkmadan reklam çalışır mı?** Geliştirme aşamasında Google'ın
  TEST reklamları kullanılır; gerçek reklamlar mağaza onayından sonra açılır.

## ✅ ENTEGRASYON TAMAMLANDI (2026-07-03)
Verdiğin ID'lerle her şey bağlandı:
- **App ID:** `ca-app-pub-3400523383108649~8516756590`
- **Ödüllü Reklam Birimi:** `ca-app-pub-3400523383108649/6189177394`

Yapılanlar:
- `@capacitor-community/admob` eklentisi `package.json`'a eklendi (Codemagic kurar).
- `index.html`'de `playRewardedAd()` gerçek AdMob ödüllü reklamını gösterir; tarayıcı/
  masaüstünde eski simülasyon çalışır (test için).
- `codemagic.yaml`'a **Info.plist yapılandırma adımı** eklendi (App ID + izleme izni;
  App ID olmadan uygulama açılışta çöker).
- `privacy.html` + `PRIVACY.md` reklam + ATT açıklamasıyla güncellendi.

## 🚨 YAYINDAN ÖNCE TEK KRİTİK ADIM
`index.html` içinde `const AD_TESTING = true;` satırı var.
- **Şimdi (test/TestFlight):** `true` kalsın — Google'ın TEST reklamları gösterilir,
  kendi reklamına tıklamak hesabını YASAKLATMAZ. Güvendesin.
- **App Store'a göndermeden hemen önce:** `false` yap. O zaman GERÇEK reklamlar
  gösterilir ve para kazanmaya başlarsın. (İstersen bu adımı asistana yaptırırsın.)

## Notlar
- Android build'i şu an Codemagic'te yok. Android'e çıkarsan `AndroidManifest.xml`'e de
  App ID meta-data eklenmesi gerekir (o zaman ayarlanır).
- Gerçek reklamlar, uygulama App Store onayından ve `AD_TESTING=false` olduktan sonra çıkar.
