# ZIPZIP — Mobil (APK / IPA) Derleme Rehberi

Oyun **Capacitor** ile gerçek bir Android/iOS uygulamasına dönüştürülmeye hazırdır.
Oyunun kendisi `index.html` (tek dosya). `www/` klasörü uygulamaya gömülen kopyadır.

## Gereken araçlar (tek seferlik kurulum)
- **Node.js** (kurulu ✓)
- **Android için:** [Android Studio](https://developer.android.com/studio) (içinde Android SDK + JDK gelir)
- **iOS için:** sadece **macOS + Xcode** (Windows'ta iOS APK/IPA üretilemez)

---

## Android APK adımları

Proje klasöründe (`zipzip-platform`) sırayla:

```bash
# 1) Capacitor paketlerini kur (tek sefer)
npm install

# 2) Android platformunu ekle (tek sefer) — index.html'i www'ya kopyalar + android/ üretir
npm run add:android

# 3) Android Studio'da aç
npm run open:android
```

Android Studio açıldığında:
1. Üstte cihaz/emülatör seç.
2. **Run ▶** ile telefonda/emülatörde test et, ya da
3. **Build → Build Bundle(s) / APK(s) → Build APK(s)** ile `.apk` üret.
   APK şurada olur: `android/app/build/outputs/apk/debug/app-debug.apk`
4. Play Store için **imzalı release**: Build → Generate Signed Bundle/APK (keystore oluştur).

## Oyunu güncelledikten sonra
`index.html`'de her değişiklikten sonra uygulamaya yansıtmak için:
```bash
npm run sync
```
(Bu `index.html`'i `www/`'ya kopyalar ve Capacitor'ı senkronlar.)

---

## Notlar
- **Yön:** Oyun yatay (landscape) tasarlandı. İstersen `android/app/src/main/AndroidManifest.xml`
  içinde `android:screenOrientation="landscape"` ekleyerek kilitleyebilirsin.
- **Font:** Oyun yazı fontunu (Press Start 2P / Fredoka) internetten çeker. İnternetsizken
  sistem fontuna düşer (oyun yine çalışır). Tamamen çevrimdışı şık görünüm istersen fontları
  `www/` içine gömeriz (ayrı bir adım).
- **Dokunmatik kontroller** ve **kaydetme** (localStorage) mobilde otomatik çalışır.
- **iOS:** macOS'ta `npm run add:android` yerine `npx cap add ios`, sonra `npx cap open ios` (Xcode).
