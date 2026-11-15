// Minimal static server that mimics GitHub Pages for dist/ under /website.
// usage: node scripts/serve-dist.mjs [port]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const BASE = '/website';
const port = Number(process.argv[2] ?? 4321);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
};

async function isFile(p) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}
async function isDir(p) {
  try {
    return (await stat(p)).isDirectory();
  } catch {
    return false;
  }
}

async function send404(res) {
  const body = await readFile(join(DIST, '404.html')).catch(() => 'not found');
  res.writeHead(404, { 'content-type': types['.html'] });
  res.end(body);
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? '/', 'http://localhost');
  if (pathname === '/') {
    res.writeHead(302, { location: BASE + '/' });
    return res.end();
  }
  if (!pathname.startsWith(BASE + '/') && pathname !== BASE) return send404(res);

  const rel = normalize(decodeURIComponent(pathname.slice(BASE.length))).replace(/^(\.\.[/\\])+/, '');
  const target = join(DIST, rel);
  if (!target.startsWith(DIST.replace(/\/$/, ''))) return send404(res);

  let file = null;
  if (await isFile(target)) file = target;
  else if (await isDir(target)) {
    if (!pathname.endsWith('/')) {
      res.writeHead(301, { location: pathname + '/' });
      return res.end();
    }
    if (await isFile(join(target, 'index.html'))) file = join(target, 'index.html');
  }
  if (!file) return send404(res);

  res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
  res.end(await readFile(file));
}).listen(port, '127.0.0.1', () => console.log(`serving dist/ at http://127.0.0.1:${port}${BASE}/`));
