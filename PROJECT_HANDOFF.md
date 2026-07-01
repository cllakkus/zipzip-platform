# PROJECT_HANDOFF.md — ZIPZIP Devir Teslim Belgesi

> Bu belge, yeni bir sohbette çalışmaya kesintisiz devam edebilmek için hazırlandı.
> Son güncelleme: 2026-06-30 · Son commit: `a022917` (yerel = GitHub, push edilmiş durumda)
> Kod tabanı incelenerek doğrulanmıştır; sadece konuşma özeti değildir.

---

## 1. Projenin Amacı ve Mevcut Durumu

**ZIPZIP** — özgün karakterli, Mario-tarzı (ama telifsiz, tamamen özgün içerikli) 2D platform oyunu.
Hikâye: Kötü **Gölgehan** kızı kaçırdı; oyuncu 100 bölüm boyunca peşine düşüp kurtarır.

- **Hedef platformlar:** Web (çalışıyor) → **iOS App Store** (asıl hedef; kullanıcı Windows'ta, derleme Codemagic bulut Mac'inde) → Android (isteğe bağlı, `BUILD-APK.md` hazır).
- **Durum:** Oyun içerik olarak "yayın öncesi" seviyede. iOS bulut derleme boru hattı **doğrulandı ve çalışıyor** (Codemagic'te imzasız build BAŞARILI, `App.app.zip` üretildi). İmzalı `.ipa` için kullanıcının **Apple Developer hesabı** bekleniyor (açacağını söyledi).
- **Kritik açık iş:** Kullanıcının bildirdiği "**REKLAM İZLE'ye basınca 20. seviyeye atıyor**" hatası (bkz. §8) — bir sonraki oturumun İLK işi.

### Arka plan (önceki projeler — arşiv)
- `Desktop\kahraman-arena\` — Three.js 3D aksiyon prototipi (2 karakter, boss, menüler). Kullanıcı kapsam büyüyünce **bilerek rafa kaldırdı**; silinmedi.
- `Desktop\everything-game-dev-code\` — oyun-dev scaffold klonu (aktif profil: web). Bu oturumların CWD'si `everything-game-dev-code-main` (ZIP artığı) idi; **launch.json orada** (bkz. §5).
- `Desktop\my-game\`, `Desktop\Claude-Code-Game-Master\` — denenen/ilgisiz depolar, kullanılmıyor.

---

## 2. Tamamlanan Özellikler (kodda doğrulandı)

**Oynanış çekirdeği**
- Fizik: yerçekimi, coyote-time, jump-buffer, değişken zıplama (`GRAV=2000, JUMP=660, JUMP_HI=940, COYOTE=0.09, BUFFER=0.10`).
- 100 prosedürel bölüm (`LEVEL_COUNT=100`, tohumlu `mulberry32` → her bölüm benzersiz ama deterministik).
- Chunk üretici: düzlük, merdiven, boşluk, çift-boşluk, duvar, diken, sütun, hareketli duvar (yatay mover), asansör (dikey mover), uçuş bölgesi, kule.
- 8 biyom (`BIOMES`): Çayır→Orman→Çöl→Gecekondu→Yer Altı→Buz→Ateş Zindanı→Yanardağ; biyoma özel zemin/platform/diken materyali, dağ silüeti, ortam efekti (yaprak/toz/parıltı/kar/kor), arka plan dekoru (ağaç/kaktüs/gecekondu/kristal/çam/igloo/meşale/lav kayası), günün saati tonu (day/dawn/dusk/night + gece yıldız/ay).
- 6 düşman, **pixel canavar** çizimli: slime (walker), kertenkele (runner), kurbağa (hopper), yarasa (flyer), kaya golem (tank, 2 can), dev/ogre (brute, 3 can).
- 6 oyun içi süreli buff (`BUFFS`): hijump, grow (hasarsız+düşman eritir), speed, shield, doublejump, magnet; bölüm ortasındaki tek kristal kutudan (`pickBuff`), karakter üstünde belirgin efektlerle.
- Biyom-sonu **8 boss savaşı** (`isBossLevel`: 13/25/38/50/63/75/88/100): kafaya zıpla (stomp), mor orb'lardan kaç, HP seviyeyle artar (3→10), kafesteki kız, HP barı.
- 100. bölümde **gerçek son**: "KURTARDIN!" ekranı.
- Bölüm geçişi: kapı yok — Gölgehan kızı kaçırır, **kovalama sekansı** ile sonraki bölüm.
- Ölüm: animasyon (dönerek düşme) + ölüm müziği; ölüm ekranında **REKLAM İZLE & DEVAM** (öldüğün yerden + **2 sn dokunulmazlık** — şimdilik 2 sn'lik placeholder reklam, bkz. §4/§8), BAŞTAN, ANA MENÜ.

**Meta / arayüz**
- 2D pixel arayüz (Press Start 2P + Fredoka, Google Fonts CDN), büyük harf metinler, animasyonlu (pop/glow) pixel butonlar.
- Ana menü: DEVAM ET (kayıt varsa) / YENİ OYUN / **BÖLÜMLER** / **DÜKKAN**.
- BÖLÜMLER: 100 hücrelik ızgara; oynanmış bölümler açık, gerisi 🔒 (`MAX_KEY`), boss hücreleri kırmızı.
- DÜKKAN (sekmeli): KOSTÜM (5 kostüm, `COSTUMES`) + GÜÇLER (4 kalıcı yükseltme, `UPGRADES`: startshield/doublecoin/magnet/doublejump — oyun içi buff'lardan bağımsız, satın alınınca kalıcı uygulanır).
- Kalıcı veri (localStorage): `zipzip_save` (bölüm+skor), `zipzip_max` (kilit açma), `zipzip_coins`, `zipzip_shop` (owned/equip/upgrades).
- Ses: Web Audio sentez SFX + döngülü pentatonik müzik (bölüm ilerledikçe tempo/gerilim artar), M ile sustur.
- Mobil: dokunmatik butonlar (◀ ▶ ▲, kompakt/yarı şeffaf/animasyonlu), duyarlı canvas, no-zoom viewport.
- Kaslı + **ters kasketli** erkek kahraman; yürüme/zıplama/ölüm animasyonları; kostüm renkleri uygulanır.
- Ekran sarsıntısı (`shake`), parçacıklar, popup yazılar.

**Altyapı / dağıtım**
- Git deposu → **github.com/cllakkus/zipzip-platform** (dal: `master`; yerel=uzak senkron).
- Capacitor v6 hazır (`capacitor.config.json`: appId `com.zipzip.game`, webDir `www`).
- **Codemagic iOS derlemesi ÇALIŞIYOR** (`codemagic.yaml`, workflow `ios-zipzip`, mac_mini; imzasız simülatör build başarılı).
- `CODEMAGIC-IOS.md` (kullanıcıya adım adım iOS talimatı), `BUILD-APK.md` (Android).
- Test/dev paneli **tamamen kaldırıldı** (yayın kararı).

---

## 3. Henüz Tamamlanmayan İşler

1. **"Reklam izle → 20. seviye" hatası** — bildirildi, ÇÖZÜLMEDİ (bkz. §8, ilk iş).
2. **Gerçek ödüllü reklam (AdMob)**: `playRewardedAd()` şu an 2 sn'lik sahte geri sayım. App Store için **Capacitor AdMob eklentisi** (`@capacitor-community/admob`) + AdMob hesabı + iOS `ATT` (App Tracking Transparency) izni gerekecek. Fonksiyon tek noktadan değiştirilecek şekilde tasarlandı.
3. **Apple imzalama**: kullanıcı Apple Developer hesabı ($99/yıl) açacak → Codemagic **Code signing (iOS)** bağlanacak → `codemagic.yaml`'daki "AŞAMA 2" bloğu imzalı archive+export'a çevrilecek → TestFlight.
4. **Fontların yerelleştirilmesi**: Google Fonts CDN'den geliyor; **çevrimdışı/native pakette bozulur**. Yayından önce woff2 dosyaları indirilip `@font-face` ile yerel gömülmeli.
5. App Store meta işleri: uygulama ikonu, splash, ekran görüntüleri, gizlilik politikası metni.
6. İsteğe bağlı cilalar: ayarlar menüsü (ses düzeyi), boss'ta ölüp reklamla dönünce boss durumunun tam korunması (şu an revive boss fazına döner ama boss HP'si kaldığı yerde — hızlı test edilmeli), PWA/manifest.

---

## 4. Verilen Önemli Kararlar

- **Küçük kapsam = bitirilebilir**: Kahraman Arena (3D, çok özellikli) bilerek rafa kalktı; ZIPZIP tek dosyalık, bitirilebilir tasarlandı. Kapsamı şişirme.
- **Tek dosya mimarisi**: tüm oyun `index.html` içinde (bundler yok, bağımlılık yok). Bu bilinçli — kullanıcı kod bilmiyor, dağıtım kolay.
- **Telif güvenliği**: Mario mekaniği serbest, içerik %100 özgün (kutu "?" değil kristal; karakter/düşman/isimler özgün).
- **Prosedürel + tohumlu** bölümler (elle 100 bölüm tasarlamak yerine); geçilebilirlik matematiksel garanti (bkz. §9).
- **Kapı yerine kovalama** bölüm sonu; **zafer yazısı yok**, sadece final bölümde ending.
- **Can/hak sistemi YOK** (kullanıcı istemedi); ölüm → bölüm başı; reklamla öldüğün yerden devam.
- **iOS için bulut Mac CI = Codemagic** (kullanıcı Windows'ta; yerelde iOS derlenemez).
- Reklam şimdilik **placeholder**; gerçek SDK native pakette eklenecek.
- Push'ları **kullanıcı GitHub Desktop'tan** yapar (kimlik onun tarayıcısında); yerel commit'leri asistan atabilir.

---

## 5. Teknoloji ve Klasör Yapısı

**Teknoloji:** Saf HTML5 Canvas 2D + vanilla JS (framework yok) · Web Audio (sentez ses) · localStorage (kayıt) · Capacitor 6 (native sarmalayıcı) · Codemagic CI (iOS) · Node sadece dev/derleme scriptleri için.

```
C:\Users\cllak\OneDrive\Desktop\zipzip-platform\   ← PROJE KÖKÜ (git repo, dal: master)
├── index.html            ← OYUNUN TAMAMI (tek dosya, ~71 KB; CSS+HTML+JS)
├── design/GDD.md         ← tasarım belgesi (kısmen eski; oyunun gerisinde)
├── tools/serve.js        ← yerel test sunucusu: node tools/serve.js → http://localhost:4322
├── www/index.html        ← Capacitor web kopyası (ÜRETİLİR: npm run copy; elle düzenleme!)
├── package.json          ← Capacitor bağımlılıkları + copy/sync scriptleri
├── capacitor.config.json ← appId com.zipzip.game, webDir "www"
├── codemagic.yaml        ← iOS bulut derleme (workflow: ios-zipzip)
├── CODEMAGIC-IOS.md      ← kullanıcı için iOS adımları
├── BUILD-APK.md          ← Android derleme adımları
└── .gitignore            ← node_modules/ android/ ios/ www/ build/
```

**Oturum ortamı notları:**
- Önceki oturumların CWD'si: `Desktop\everything-game-dev-code-main` → önizleme launch config'i **oradaki** `.claude/launch.json` içinde ("zipzip", port 4322, eski scratchpad yoluna işaret eder). Yeni oturumda en sağlamı: `node tools/serve.js` ile sunucuyu başlatmak (veya launch.json'ı `tools/serve.js`'e güncellemek).
- Kalıcı hafıza dosyası: `~\.claude\projects\C--Users-cllak-OneDrive-Desktop-everything-game-dev-code-main\memory\project-kahraman-arena.md` (proje geçmişinin özeti orada da var).

---

## 6. Değiştirilen Önemli Dosyalar

- `index.html` — her şey burada. Önemli bölümler (yaklaşık satırlar değişebilir):
  SES (~L60-125) · BIOMES (~L174) · coin/kostüm/localStorage yardımcıları (~L188+) · BUFFS (~L214) · UPGRADES + dükkan (~L315+) · seviye üretici `buildLevel` · durum/`loadLevel`/`die`/`reviveAtSpot`/`adContinue`/`playRewardedAd` (~L305-395) · `update()` (fizik+boss+kovalama) · `draw()` + `drawPlayer/drawEnemy/drawBoss/drawVillain/drawDeco` · en altta buton bağlamaları + dokunmatik `bindTouch`.
- `codemagic.yaml`, `package.json`, `capacitor.config.json`, `CODEMAGIC-IOS.md`, `BUILD-APK.md`, `.gitignore` — dağıtım altyapısı.
- `tools/serve.js` — bu devirle eklendi (kalıcı dev sunucu).

---

## 7. Çalışan ve Çalışmayan Bölümler

**Çalıştığı doğrulananlar** (kod içine geçici `window.__dbg` kancası ekleyip `update(dt)` elle adımlanarak test edildi, sonra kanca kaldırıldı):
- Fizik/çarpışma/mover'lar (titreme ve büyüme-düşme hataları düzeltildi, foot-offset 0 ölçüldü).
- 100 bölümün geçilebilirliği: en geniş ölümcül boşluk 118 px < koşarak atlama 176 px.
- Boss akışı: stomp→HP düşer→yenilgi→kovalama; final boss→ending.
- Bölüm kilidi, dükkan satın alma/kuşanma, kalıcı güçlerin uygulanması, coin birikimi.
- Reklam-devam **iç mantığı** (`reviveAtSpot`: doğru konum + 2.0 sn invuln) — test ortamında doğru çalıştı; kullanıcının gördüğü hata henüz yeniden üretilemedi (§8).
- Codemagic iOS derlemesi (gerçek bulut build BAŞARILI).

**Çalışmayan / eksik:** §3'teki liste + §8'deki hata.

---

## 8. Bilinen Hatalar

### 🔴 #1 (AÇIK, İLK İŞ): "REKLAM İZLE & DEVAM" → 20. seviyeye atıyor
- Kullanıcı bildirimi; ben yeniden üretemeden oturum kesildi.
- **Kod okumasına göre** `adContinue→playRewardedAd→reviveAtSpot` zinciri `state.levelIdx`'e HİÇ dokunmuyor; seviye değiştirebilen tek yollar: `startGame(true)` (kayıttan), `startAtLevel`, `nextLevel`, `restartLevel`.
- **En güçlü hipotez:** Kaldırılan test paneli döneminde `startAt()` → `loadLevel()` → `saveProgress()` zinciri kullanıcının `zipzip_save`'ine **lvl≈19 yazdı** (test paneli seviye atlarken kaydı da güncelliyordu — doğrulanmış yan etki). Kullanıcının tarayıcısında bu bayat kayıt + muhtemelen bayat önbellek (eski HTML) birleşince "20. seviyeye atma" görüntüsü oluşuyor olabilir.
- **Yapılacak:** (1) Kullanıcıdan Ctrl+F5 + DevTools'suz basit yolla localStorage temizletme (oyuna geçici "kayıtları sıfırla" butonu eklemek en kolayı) → yeniden dene. (2) Hâlâ oluyorsa `adContinue`/`reviveAtSpot`'a geçici log ekleyip repro al. (3) Kalıcı önlem: `reviveAtSpot` başına `if(!state||!state.level) return restartLevel();` guard'ı + kayda yazmayı sadece gerçek oynanışta yapmak.
- İlgili risk: `keydown "KeyR" → startGame()` her an tam sıfırlama yapıyor (menüde/ölümde dahil). Yayın öncesi kaldırılmalı veya sadece `phase==="play"` iken çalışmalı.

### 🟡 #2: Yerel `www/index.html` bayat (29 Haziran)
`npm run copy` çalıştırılmadı. **Codemagic etkilenmez** (build sırasında kendisi kopyalıyor) ama yerelde kafa karıştırır. Düzeltme: `Copy-Item index.html www\index.html` (veya npm run copy).

### 🟡 #3: Google Fonts CDN bağımlılığı
İnternetsiz/native pakette pixel font düşer (bkz. §3.4).

### ⚪ Önizleme ortamı kısıtları (hata değil, bilgi):
Arka plan sekmesinde `requestAnimationFrame` donar → `preview_screenshot` HEP zaman aşımı verir. Doğrulama yöntemi: geçici `window.__dbg` kancası + `preview_eval` ile `update(dt)`'yi elle adımlamak, işi bitince kancayı silmek. Ekran görüntüsü istenirse kullanıcıdan istenir.

---

## 9. Kesinlikle Bozulmaması Gerekenler

1. **Geçilebilirlik sınırları** (chunk üreticide): boşluk ≤118 px, duvar ≤90 px, diken ≤106 px. Koşarak atlama menzili ~176 px, normal zıplama ayak erişimi ~y337, buff'lı ~y227. Chunk/fizik sabitleriyle oynarsan **tüm 100 bölümü tarayan geçilebilirlik testini** yeniden çalıştır.
2. **Fizik sabitleri** (§2'de) — "oyun hissi" bunlarla ayarlandı, kullanıcı onayladı.
3. **localStorage anahtarları** (`zipzip_save/max/coins/shop`) — değiştirirsen mevcut oyuncu ilerlemesi silinir.
4. **`codemagic.yaml` + `package.json` copy scripti + `capacitor.config.json` (webDir "www")** — çalışan iOS boru hattı buna bağlı.
5. **`buildLevel`'ın deterministik tohumu** — değişirse BÖLÜMLER kilidi/dengelenmiş bölümler farklılaşır.
6. **Tek dosya yapısı** — index.html'i parçalara bölme (kullanıcı akışı ve Capacitor kopyası buna göre).
7. `www/` üretilen dosyadır; elle düzenleme.

---

## 10. Kullanıcının Kalıcı Kuralları / Tercihleri

- **Türkçe konuş.** Kullanıcı kod bilmiyor ("vibe coding'e yeni") → her adımı **tıkla-geç düzeyinde, ekran ekran** anlat (GitHub Desktop, Codemagic UI örneklerindeki gibi). Ekran görüntüsü atar; ona göre yönlendir.
- Her değişikliği **canlı çalıştırarak doğrula** ve kanıtıyla raporla; test kancalarını işin sonunda mutlaka kaldır.
- Tarayıcı önbelleği yüzünden eski sürüm görmesi klasik sorun → her teslimde **Ctrl+F5** hatırlat.
- Oyun tercihleri: can/hak sistemi yok · zafer yazısı yok (kovalama geçişi) · Mario'ya birebir benzeyen öğe yok · pixel/2D estetik · butonlar kompakt, oyunu kapatmasın · metinler BÜYÜK HARF · seviye sayısı HUD'da "kaçıncı seviye" olarak (toplamı gösterme).
- Ölünce **bölüm başına** dönülür (öldüğün yerde doğma yok) — tek istisna reklamla devam.
- Reklam-devam: öldüğü yerden + 2 sn dokunulmazlık; App Store kurallarına uygun olacak.
- Push'ları kullanıcı GitHub Desktop'tan yapar; Apple Developer hesabını kendisi açacak.
- Kalıcı hafıza dosyasını (bkz. §5) güncel tut.

---

## 11. Yeni Sohbette İLK ADIM

1. **`node tools/serve.js`** ile sunucuyu başlat (http://localhost:4322), oyunun açıldığını doğrula.
2. **Hata #1'i çöz** (§8): önce kullanıcının localStorage'ındaki bayat `zipzip_save`'i sıfırlatacak güvenli bir yol ekle/uygula, repro almaya çalış, `reviveAtSpot`'a guard ekle, `KeyR` sıfırlamasını yayına uygun hale getir.
3. `npm run copy` (veya dosya kopyası) ile `www/`'yi tazele; `tools/serve.js` + `PROJECT_HANDOFF.md` + düzeltmeleri commit'le → kullanıcıya **GitHub Desktop'tan Push** yaptır → Codemagic'te yeşil build teyidi.
4. Sonraki sıra: Apple Developer hesabı geldiyse Codemagic Code signing + imzalı .ipa; gelmediyse font yerelleştirme / AdMob hazırlığı.
