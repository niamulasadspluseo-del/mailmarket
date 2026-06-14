import http, { createServer } from "node:http";
import { spawn } from "node:child_process";
import { resolve, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || "3000", 10);
const PHP_PORT = 8080;
const CLIENT_DIR = resolve(__dirname, "dist/client");

// Start Laravel PHP server
const php = spawn("php", [
  "artisan", "serve",
  "--port", String(PHP_PORT),
  "--host", "127.0.0.1",
], {
  cwd: resolve(__dirname, "backend"),
  stdio: ["ignore", "pipe", "pipe"],
});

php.stdout.on("data", (d) => process.stdout.write(`[php] ${d}`));
php.stderr.on("data", (d) => process.stderr.write(`[php] ${d}`));
php.on("exit", (code) => console.log(`[php] exited with code ${code}`));

// Wait for PHP to start
await new Promise((resolve) => setTimeout(resolve, 2000));

// Start SSR handler
const { default: handler } = await import(resolve(__dirname, "./dist/server/server.js"));

const MIME = {
  ".js": "application/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json",
};

function proxyToPhp(req, res) {
  const options = {
    hostname: "127.0.0.1",
    port: PHP_PORT,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `127.0.0.1:${PHP_PORT}` },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on("error", () => {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Backend unavailable" }));
  });

  req.pipe(proxyReq);
}

async function serveStatic(req, res) {
  // Only serve GET/HEAD for static files
  if (req.method !== "GET" && req.method !== "HEAD") return false;

  const url = new URL(req.url ?? "/", "http://localhost");
  let pathname = url.pathname;

  // Skip API routes
  if (pathname.startsWith("/api")) return false;

  // Default to index.html for root
  if (pathname === "/" || pathname === "") pathname = "/index.html";

  const filePath = resolve(CLIENT_DIR, pathname.slice(1));

  // Ensure the resolved path is within CLIENT_DIR (prevent path traversal)
  if (!filePath.startsWith(CLIENT_DIR)) return false;

  try {
    const data = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
    return true;
  } catch {
    return false;
  }
}

const server = createServer(async (req, res) => {
  // Proxy /api requests to PHP
  if (req.url?.startsWith("/api")) {
    return proxyToPhp(req, res);
  }

  // Try serving static files from dist/client
  const served = await serveStatic(req, res);
  if (served) return;

  // SSR for all other requests
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", async () => {
    try {
      const body = chunks.length ? Buffer.concat(chunks) : undefined;
      const request = new Request(url, { method: req.method, headers: req.headers, body });
      const response = await handler.fetch(request, {}, {});
      res.writeHead(response.status, Object.fromEntries(response.headers));
      if (response.body) {
        for await (const chunk of response.body) res.write(chunk);
      }
      res.end();
    } catch (err) {
      console.error("SSR error:", err);
      res.writeHead(500, { "Content-Type": "text/html" });
      res.end("<h1>Internal Server Error</h1>");
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
  console.log(`API proxying to PHP on http://127.0.0.1:${PHP_PORT}`);
});

process.on("SIGTERM", () => { php.kill(); server.close(); process.exit(0); });
