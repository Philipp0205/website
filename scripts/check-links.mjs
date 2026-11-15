// Internal link + asset check over dist/. No network: external links are skipped.
// Every href/src/srcset/og:image in built HTML that points at this site must resolve to a file.
// Also checks that dist/ contains nothing from drafts or the stale JBake leftovers.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative, posix } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const BASE = '/website';
const SITE = 'https://philipp0205.github.io';

const errors = [];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function resolveToFile(pathname) {
  // pathname is site-absolute including BASE, e.g. /website/about/
  if (!pathname.startsWith(BASE + '/') && pathname !== BASE) return null;
  const rel = decodeURIComponent(pathname.slice(BASE.length)).replace(/^\//, '');
  const target = join(DIST, rel);
  if (!target.startsWith(DIST)) return null;
  if (existsSync(target) && statSync(target).isFile()) return target;
  if (existsSync(join(target, 'index.html'))) return join(target, 'index.html');
  return null;
}

const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
if (htmlFiles.length === 0) {
  console.error('no html files in dist/ (did the build run?)');
  process.exit(1);
}

const attr = /\s(?:href|src|poster|content)=(?:"([^"]*)"|'([^']*)')|\ssrcset="([^"]*)"/g;
let checked = 0;

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const pagePath = BASE + '/' + relative(DIST, file).split('\\').join('/').replace(/index\.html$/, '');
  for (const m of html.matchAll(attr)) {
    const values = m[3] !== undefined ? m[3].split(',').map((s) => s.trim().split(/\s+/)[0]) : [m[1] ?? m[2]];
    for (let value of values) {
      if (!value) continue;
      // `content="..."` is only a link when it is an absolute URL on this site or a site-absolute path.
      if (m[0].trimStart().startsWith('content=') && !value.startsWith(SITE) && !value.startsWith(BASE + '/')) continue;
      if (/^(mailto:|tel:|data:|javascript:|#)/.test(value)) continue;
      if (value.startsWith(SITE)) value = value.slice(SITE.length) || '/';
      else if (/^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('//')) continue; // external
      const clean = value.split('#')[0].split('?')[0];
      if (!clean) continue;
      const abs = clean.startsWith('/') ? clean : posix.normalize(posix.join(pagePath, clean));
      checked++;
      if (!clean.startsWith('/')) {
        errors.push(`${relative(DIST, file)}: relative link "${value}" (use base-aware absolute paths)`);
        continue;
      }
      if (!abs.startsWith(BASE + '/') && abs !== BASE) {
        errors.push(`${relative(DIST, file)}: "${value}" escapes base ${BASE}`);
        continue;
      }
      if (!resolveToFile(abs)) errors.push(`${relative(DIST, file)}: broken link "${value}"`);
    }
  }
}

// Things that must NOT exist in the output.
const forbidden = [
  'blog/2013/second-post.html',
  'blog/2025/second-post.html',
  'blog/2025/KW3.html',
  'blog/2025/KW3/index.html',
  'blog/drafts/KW3.html',
  'drafts/KW3.html',
  'main.tex',
];
for (const f of forbidden) {
  if (existsSync(join(DIST, f))) errors.push(`stale/draft output must not exist: ${f}`);
}

// Things that MUST exist.
const required = [
  'index.html',
  'about/index.html',
  'projects/index.html',
  'cv/index.html',
  'archive/index.html',
  'blog/2025/KW2/index.html',
  'tags/blog/index.html',
  'feed.xml',
  'sitemap-index.xml',
  'sitemap.xml',
  'about/philipp.jpg',
  'favicon.ico',
  '404.html',
  // old .html paths become redirect pages
  'index.html',
  'about.html',
  'archive.html',
  'blog/2025/KW2.html',
];
for (const f of required) {
  if (!existsSync(join(DIST, f))) errors.push(`missing expected output: ${f}`);
}

// Drafts must not leak into feed, sitemap, archive or tag pages.
const leakChecks = ['feed.xml', 'archive/index.html', 'tags/blog/index.html', 'index.html'];
for (const f of leakChecks) {
  const p = join(DIST, f);
  if (existsSync(p) && /KW3/.test(readFileSync(p, 'utf8'))) errors.push(`draft KW3 leaked into ${f}`);
}
for (const f of files.filter((f) => /sitemap.*\.xml$/.test(f))) {
  if (/KW3/.test(readFileSync(f, 'utf8'))) errors.push(`draft KW3 leaked into ${relative(DIST, f)}`);
}

// No third-party runtime requests in built pages.
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com|googletagmanager|google-analytics/.test(html)) {
    errors.push(`${relative(DIST, file)}: third-party runtime request found`);
  }
}

if (errors.length) {
  console.error(`${errors.length} problem(s):`);
  for (const e of [...new Set(errors)]) console.error(' - ' + e);
  process.exit(1);
}
console.log(`checked ${checked} internal references in ${htmlFiles.length} html files`);
