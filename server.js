/* ZAMP Funds — minimal zero-dependency static server for Railway.
   Serves the site on $PORT (Railway sets this). No npm dependencies. */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8",
};

function send(res, status, body, headers) {
  res.writeHead(status, headers || {});
  res.end(body);
}

const server = http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath === "/") urlPath = "/index.html";
    let filePath = path.join(ROOT, urlPath);
    if (!path.extname(filePath) && fs.existsSync(filePath + ".html")) filePath += ".html";

    const resolved = path.resolve(filePath);
    if (!resolved.startsWith(path.resolve(ROOT))) return send(res, 403, "Forbidden");

    fs.stat(resolved, (err, stat) => {
      if (err || !stat.isFile()) {
        const fallback = path.join(ROOT, "index.html");
        return fs.readFile(fallback, (e2, buf) => {
          if (e2) return send(res, 404, "Not found");
          send(res, 404, buf, { "Content-Type": TYPES[".html"] });
        });
      }
      const type = TYPES[path.extname(resolved).toLowerCase()] || "application/octet-stream";
      const cache = /\.(woff2?|png|jpe?g|svg|webp|ico)$/i.test(resolved)
        ? "public, max-age=31536000, immutable"
        : "public, max-age=3600";
      fs.readFile(resolved, (e3, buf) => {
        if (e3) return send(res, 500, "Server error");
        send(res, 200, buf, { "Content-Type": type, "Cache-Control": cache });
      });
    });
  } catch (e) {
    send(res, 500, "Server error");
  }
});

server.listen(PORT, () => {
  console.log("ZAMP Funds site running on port " + PORT);
});
