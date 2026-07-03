// ZIPZIP yerel test sunucusu — kullanım: node tools/serve.js  ->  http://localhost:4322
const http = require("http");
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  // dev aracı: sayfadan üretilen görselleri diske kaydet (store-assets/ altına)
  if (req.method === "POST" && p === "/save") {
    const name = (new URL(req.url, "http://x").searchParams.get("name") || "").replace(/[^a-zA-Z0-9._-]/g, "");
    if (!name) { res.writeHead(400); res.end("name?"); return; }
    const dir = path.join(root, "store-assets");
    fs.mkdirSync(dir, { recursive: true });
    const chunks = [];
    req.on("data", c => chunks.push(c));
    req.on("end", () => { fs.writeFileSync(path.join(dir, name), Buffer.concat(chunks)); res.writeHead(200); res.end("ok"); });
    return;
  }
  if (p === "/") p = "/index.html";
  const fp = path.join(root, p);
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end("404 Not Found"); return; }
    res.writeHead(200, { "Content-Type": mime[path.extname(fp)] || "application/octet-stream" });
    res.end(data);
  });
}).listen(4322, () => console.log("ZIPZIP: http://localhost:4322"));
