// ZIPZIP uygulama ikonu + splash üretici (bağımlılıksız, saf Node)
// Kullanım: node tools/gen-assets.js  ->  resources/icon.png (1024) + resources/splash.png (2732)
// App Store/Play Store paketlemesinde `npx @capacitor/assets generate` bu iki dosyadan tüm boyutları türetir.
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// ---- minik PNG kodlayıcı (RGBA, filtre 0) ----
const CRC_TABLE = (() => { const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c; } return t; })();
function crc32(buf) { let c = ~0; for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8); return ~c >>> 0; }
function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0); out.write(type, 4, "ascii"); data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length); return out;
}
function encodePNG(w, h, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4); }
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

// ---- yardımcılar ----
const hex = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
const lerp = (a, b, t) => a + (b - a) * t;
const mix = (c1, c2, t) => [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
// kenar yumuşatma: imzalı mesafeden kapsama (0..1)
const cov = (d, aa) => clamp01(0.5 - d / aa);

const SKY0 = hex("#5bb8f0"), SKY1 = hex("#a8dcf5"), SKY2 = hex("#d8f0e0");
const SUN = hex("#fff6d8"), GLOW = hex("#ffecaa");
const HILL1 = hex("#9bd3a4"), HILL2 = hex("#7bbf86"), GRASS = hex("#4caf50");
const SKIN = hex("#e8b886"), HAT = hex("#2a3f7a"), HATD = hex("#1a2a55"), HATL = hex("#4a5f9a");
const EYE = hex("#222222"), MOUTH = hex("#8a4a2a"), OUT = hex("#000000");

function render(S, headR, groundY) {
  const px = Buffer.alloc(S * S * 4);
  const cx = S * 0.5, cy = S * 0.52, R = headR;
  const sunX = S * 0.80, sunY = S * 0.20, sunR = S * 0.052;
  const aa = Math.max(1.5, S / 700); // AA genişliği
  const headTop = cy - R * 0.30;      // kasket kubbesinin taban çizgisi

  for (let y = 0; y < S; y++) {
    const ty = y / S;
    for (let x = 0; x < S; x++) {
      // gökyüzü gradyanı
      let c = ty < 0.62 ? mix(SKY0, SKY1, ty / 0.62) : mix(SKY1, SKY2, (ty - 0.62) / 0.38);
      // güneş halesi + diski
      const sd = Math.hypot(x - sunX, y - sunY);
      if (sd < S * 0.19) c = mix(c, GLOW, 0.55 * clamp01(1 - sd / (S * 0.19)));
      { const k = cov(sd - sunR, aa); if (k > 0) c = mix(c, SUN, k); }
      // tepeler (iki elips) + zemin bandı
      const h1 = ((x - S * 0.20) / (S * 0.50)) ** 2 + ((y - S * 1.02) / (S * 0.36)) ** 2;
      const h2 = ((x - S * 0.85) / (S * 0.55)) ** 2 + ((y - S * 1.05) / (S * 0.42)) ** 2;
      if (h2 < 1) c = HILL2.slice();
      if (h1 < 1) c = HILL1.slice();
      if (y > S * groundY) c = GRASS.slice();
      // kafa altına yumuşak gölge
      const shd = ((x - cx) / (R * 1.05)) ** 2 + ((y - S * groundY - R * 0.06) / (R * 0.16)) ** 2;
      if (shd < 1) c = mix(c, OUT, 0.18 * (1 - shd));
      // KAFA
      const hd = Math.hypot(x - cx, y - cy) - R;
      { const k = cov(hd, aa); if (k > 0) c = mix(c, SKIN, k); }
      { const k = cov(Math.abs(hd) - S * 0.004, aa); if (k > 0) c = mix(c, OUT, 0.25 * k); } // kontur
      // KASKET: kubbe (üst yarım daire) + bant + arkaya siper + toka + tepe düğmesi
      const dd = Math.hypot(x - cx, y - headTop) - R * 1.08;
      if (y <= headTop) { const k = cov(dd, aa); if (k > 0) c = mix(c, HAT, k); }
      if (x >= cx - R * 1.08 && x <= cx + R * 1.08 && y >= headTop - R * 0.04 && y <= headTop + R * 0.28) c = HAT.slice();
      if (x >= cx - R * 1.72 && x <= cx - R * 0.65 && y >= headTop - R * 0.02 && y <= headTop + R * 0.22) c = HAT.slice(); // siper (arkaya/sola)
      if (x >= cx + R * 0.50 && x <= cx + R * 0.86 && y >= headTop && y <= headTop + R * 0.24) c = HATD.slice();          // ayar tokası
      if (x >= cx - R * 0.18 && x <= cx + R * 0.18 && y >= cy - R * 1.30 && y <= cy - R * 1.04) c = HATL.slice();          // tepe düğmesi
      // GÖZLER + parlaklık
      for (const [ex, hx2] of [[cx - R * 0.30, cx - R * 0.26], [cx + R * 0.30, cx + R * 0.34]]) {
        { const k = cov(Math.hypot(x - ex, y - (cy + R * 0.05)) - R * 0.13, aa); if (k > 0) c = mix(c, EYE, k); }
        { const k = cov(Math.hypot(x - hx2, y - cy) - R * 0.045, aa); if (k > 0) c = mix(c, [255, 255, 255], k); }
      }
      // GÜLÜMSEME (alt yay)
      const mdx = x - cx, mdy = y - (cy + R * 0.35);
      if (mdy > R * 0.10 && Math.abs(mdx) < R * 0.30) {
        const k = cov(Math.abs(Math.hypot(mdx, mdy) - R * 0.28) - S * 0.007, aa);
        if (k > 0) c = mix(c, MOUTH, k);
      }
      const i = (y * S + x) * 4;
      px[i] = c[0]; px[i + 1] = c[1]; px[i + 2] = c[2]; px[i + 3] = 255;
    }
  }
  return encodePNG(S, S, px);
}

const outDir = path.join(__dirname, "..", "resources");
fs.mkdirSync(outDir, { recursive: true });
console.log("icon.png (1024) üretiliyor…");
fs.writeFileSync(path.join(outDir, "icon.png"), render(1024, 1024 * 0.26, 0.88));
console.log("splash.png (2732) üretiliyor…");
fs.writeFileSync(path.join(outDir, "splash.png"), render(2732, 2732 * 0.17, 0.86));
console.log("TAMAM ->", outDir);
