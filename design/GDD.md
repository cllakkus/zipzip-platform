# GDD — ZIPZIP (2D Platform Oyunu)

## Doküman Bilgisi
- Proje: ZIPZIP (çalışma adı)
- Tür: 2D yandan kaydırmalı platform (Mario tarzı tür mekaniği, **özgün içerik**)
- Platform: Web (HTML5 Canvas), tarayıcıda çalışır
- Sürüm: 0.1 (Taslak) · 2026-06-28
- Telif notu: Tür mekanikleri (zıplama, ezme, platform) serbesttir; **karakter/düşman/power-up
  tasarımları ve isimleri özgündür** — hiçbir Nintendo/Mario varlığı kullanılmaz.

## 1. Amaç & Hikâye (sürüm 0.6)
Kötü **Gölgehan**, Zıpzıp'ın arkadaşı **kızı kaçırdı**. Oyuncu 20 bölüm boyunca peşine düşer.
Her bölümün sonunda Gölgehan, kızı taşıyarak **harita dışına kaçar**; Zıpzıp **peşinden koşar**
(otomatik kovalama) ve sonraki bölüm başlar. Amaç: kovala, engelleri aş, kızı kurtar.
(Kapı kaldırıldı — yerine kötü+rehin kovalama sekansı.)

## 2. Çekirdek Mekanik (tek odak)
**Zıpla, platformlardan geç, düşmanları ez, portala ulaş.** Hepsi bu. Dağılmıyoruz.

## 3. Kontroller
- **← →** hareket · **Boşluk / ↑** zıpla (basılı tutarsan biraz daha yükselir)
- Çift zıplama: sadece **Çift Zıplama Kristali** topladıysan.

## 4. Sistemler
### 4.1 Hareket & Zıplama (oyun "his"i burada)
- Yerçekimi, koşma ivmesi, zeminde durma. İyi his için: **coyote time** (kenardan düşerken kısa
  zıplama hakkı) + **jump buffer** (erken basışı hatırlama) + değişken zıplama yüksekliği.

### 4.2 Düşmanlar
- Basit gezen düşman (örn. "Dikenli"). Üstüne zıplarsan **ezersin** (sek + puan). Yandan değerse
  **canın azalır**. Özgün tasarım.

### 4.3 Toplananlar & Buff
- **Yıldız Tozu:** puan.
- **Çift Zıplama Kristali (buff):** havada bir kez daha zıplama (Mario'nun mantarı DEĞİL — özgün).
- (İleride: hız rozeti, kalkan baloncuğu.)

### 4.4 Can / Kaybetme
- 3 can. Düşmana yandan değmek veya **boşluğa düşmek** → can −1, bölüm başına dönüş.
- 0 can → "Yeniden Dene".

### 4.4c Sürüm 0.6 — çeşitlilik, hareketli engeller, müzik, kovalama (en güncel)
- **20 benzersiz açılış**: chunk üreticisi her bölüme farklı açılış + farklı dizilim verir (kopya yok).
- **Çok daha uzun bölümler** (~4900→11300 px) ve **zemin yolunda yoğun düşman** (~5→16).
- **Ödül kutusu bölüm ORTASINDA** (~%45), başta değil.
- **Hareketli engeller**: yatay **hareket eden duvarlar** (katı, zamanlama) + dikey **asansörler**
  (üstüne binip taşınırsın). Seviyeye göre artar.
- **Arka plan müziği**: Web Audio ile döngülü chiptune (melodi+bas), bölüm bandına göre ton değişir. **M** = sustur.
- **Bitiş = kovalama**: Gölgehan + rehin kız çizilir; sona varınca kaçarlar, Zıpzıp peşinden koşar → sonraki bölüm.

### 4.4b Sürüm 0.5 — 20 seviye, tuzaklar, sesler
- **20 seviye**, **chunk tabanlı üretici**: her seviye farklı parçalardan kurulur (düzlük, merdiven,
  boşluk, çift-boşluk, **duvar**, **dikenli tuzak**, **sütun dizisi**, **kule**) → kopya değil, gerçek çeşitlilik.
- **Kademeli zorluk**: boşluk/duvar/diken/düşman seviyeyle açılır ve büyür; seviyeler uzar (~3000→7400 px).
  Tüm engeller doğrulanmış sınırlar içinde (boşluk ≤118, duvar ≤90, diken ≤106; atlama menzili 176) — **hepsi geçilebilir**.
- **Tuzaklar:** dikenli tuzaklar — değince **ölüm** (çevresel; büyüme korumaz). Boşluğa düşmek de ölüm.
- **Duvarlar:** taş duvarlar — üstüne zıplayıp aşılır (katı engel).
- **Ölünce bölüm BAŞINA dönülür** (öldüğün yerde değil); skor korunur, hak sayacı yok (sınırsız deneme).
- **Ödül kutusu:** Mario "?" bloğu değil — **parlayan kristal/gem** (mor-mavi=yüksek zıplama, turuncu=büyüme).
- **Sesler:** Web Audio sentezi — zıplama, coin, özel coin, ezme, buff, ölüm, kapı, hasar. **M** ile sustur.

### 4.5 Bölümler & Bitiş
- **Kesintisiz katı zemin** (çukur yok) — düşmez. Yükseltili platformlar ulaşılabilir
  (zıplama ayak menzili ≈ y337); **özel ödül tepeleri** daha yüksek (≈ y235), sadece **buff ile** çıkılır.
- **3 uzun bölüm**, her biri farklı tema ve zorluk; sonsuz döngü.
- **Can/hak YOK.** Düşmana yandan değince ölmezsin, sadece **geri savrulursun** (+kısa dokunulmazlık).
- **Bölüm geçişi:** çıkıştaki **kapıdan girersin** (küçülerek kaybolursun) → kamera sabit kalır →
  **"SEVİYE N" yazısı** belirir → yazı gidince sonraki bölüm başlar. Zafer yazısı yok.

### 4.6 Gizli Kutu & Buff
- Yerden zıplayıp **gizli "?" kutusuna** vurunca (veya üstüne basınca) süreli **Yüksek Zıplama** buff'ı.
- Buff alınca havada büyüyüp yükselen **"⬆ YÜKSEK ZIPLAMA!"** yazısı + karakterde parıltı + HUD süre çubuğu.
- Buff ile özel ödül tepelerine (büyük ⭐ +50) çıkılır.

### 4.7 Düşman türleri (bölümlere göre artan zorluk)
- **Walker** (yavaş), **Runner** (hızlı), **Hopper** (zıplayan), **Tank** (büyük, 2 vuruş gerekir).
- Bölüm 1 Çayır (kolay, walker) · Bölüm 2 Alacakaranlık (walker+runner) · Bölüm 3 Yanardağ (tank+hopper+runner).

### 4.8 Görsel
- Bölüme özel gökyüzü/zemin/tepe renkleri (tema). Animasyonlu karakter (yürüyen bacaklar, zıplama
  esnemesi, göz kırpma, buff parıltısı), sallanan düşmanlar, dönen yıldız tozu, parlayan kapı.

## 5. Görsel (placeholder, özgün)
- Basit şekiller: Zıpzıp = renkli yuvarlak + kulak/göz; platformlar bloklar; arka plan katmanlı (parallax).
- Okunaklılık: kahraman, düşman, zemin, toplanan net ayırt edilir.

## 6. Kapsam (bitirme disiplini)
**VAR:** hareket+zıplama, platform/boşluk, düşman ezme, yıldız tozu, çift-zıplama buff, can, bölümler, bitiş.
**YOK (sonra):** çok düşman çeşidi, boss, hikâye, ses (sonra), çok dünya.

## 7. Yol Haritası
1. ✅ Bölüm 1 oynanır (hareket+zıpla+düşman+portal)
2. ✅ Buff (çift-zıplama kristali) + yıldız tozu + can
3. ✅ 2 bölüm + "Kazandın!" ekranı = **oynanır bitiş var**
4. ⬜ Cila: ses, daha çok bölüm, yeni buff (hız/kalkan), checkpoint

## 8. Değişiklik Günlüğü
- 2026-06-28 / 0.1 / platform oyunu tasarımı, bitirme odaklı kapsam
