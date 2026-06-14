import http, { createServer } from "node:http";
import { spawn } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || "3000", 10);
const PHP_PORT = 8080;

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

const server = createServer((req, res) => {
  // Proxy /api requests to PHP
  if (req.url?.startsWith("/api")) {
    return proxyToPhp(req, res);
  }

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
