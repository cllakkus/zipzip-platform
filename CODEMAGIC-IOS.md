# ZIPZIP — iOS'u Bulut Mac (Codemagic) ile Derleme

Windows'tasın, iOS derlemesi Mac gerektirir. **Codemagic** bulutta bir Mac'te derler.
Proje hazır: `codemagic.yaml` derleme adımlarını içerir.

## Ön koşullar
1. **GitHub hesabı** (ücretsiz) — kodu buraya yükleyeceğiz.
2. **Codemagic hesabı** (ücretsiz) — https://codemagic.io ile GitHub'a bağlanırsın.
3. **(Gerçek cihaza/TestFlight'a kurmak için) Apple Developer hesabı** — $99/yıl.
   - Bu olmadan: Codemagic kodu **derler** (boru hattı doğrulanır) ama imzalı,
     iPhone'a kurulabilir `.ipa` üretmek için Apple hesabı şarttır.

---

## Adım 1 — Kodu GitHub'a yükle
Proje klasöründe (`zipzip-platform`) — git deposu hazırlandı. Şu komutlarla yükle:

```bash
# GitHub'da boş bir repo aç (örn. "zipzip"), sonra:
git remote add origin https://github.com/KULLANICI_ADIN/zipzip.git
git branch -M main
git push -u origin main
```
(Repo adresini kendi GitHub kullanıcı adınla değiştir.)

## Adım 2 — Codemagic'e bağla
1. https://codemagic.io → GitHub ile giriş yap.
2. "Add application" → `zipzip` reposunu seç.
3. Yapılandırma olarak **`codemagic.yaml`** otomatik bulunur.
4. **Start new build** → `ios-zipzip` iş akışını seç → derleme başlar (bulut Mac'te).

Bu **Aşama 1** derlemesi imzasızdır: amacı boru hattının çalıştığını doğrulamaktır
(oyun bulutta sorunsuz iOS'a derleniyor mu?). Loglarda "BUILD SUCCEEDED" görürsün.

## Adım 3 — Gerçek iPhone / TestFlight (Apple hesabı gerekince)
Apple Developer hesabın olunca:
1. Codemagic > uygulaman > **Settings → Code signing (iOS)**: Apple Developer hesabını bağla
   (Codemagic otomatik sertifika/provisioning yönetir).
2. `codemagic.yaml` içindeki "AŞAMA 2" notunu imzalı archive+export'a çeviririz (ben yaparım).
3. Derleme **`.ipa`** üretir → TestFlight'a yükleyip telefonunda test edebilirsin.

---

## Notlar
- iOS platformu (`ios/` klasörü) bulut Mac'te `npx cap add ios` ile otomatik üretilir
  (Windows'ta oluşturulamaz; o yüzden git'e dahil değil).
- Oyunu güncelledikçe: `index.html`'i değiştir → GitHub'a `git push` → Codemagic otomatik
  (veya elle) yeniden derler.
- **Android (Windows'ta yapılabilir):** test için daha kolay; bkz. `BUILD-APK.md`.
