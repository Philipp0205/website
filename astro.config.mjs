import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// @astrojs/sitemap writes sitemap-index.xml (+ sitemap-0.xml). The old site served /sitemap.xml,
// so keep that path alive by copying the index to it after the build.
const keepSitemapXml = {
  name: 'keep-sitemap-xml',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const out = fileURLToPath(dir);
      await copyFile(`${out}sitemap-index.xml`, `${out}sitemap.xml`);
    },
  },
};

// Project site on GitHub Pages: https://philipp0205.github.io/website/
export default defineConfig({
  site: 'https://philipp0205.github.io',
  base: '/website',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [sitemap(), keepSitemapXml],
  // Old JBake .html paths (/about.html, /archive.html, /blog/2025/KW2.html) are emitted as static
  // HTML redirect files by the endpoints src/pages/*.html.ts, so they exist at the exact old path.
  // (Astro's `redirects` option would write about.html/index.html instead, i.e. an extra 301 hop on
  // GitHub Pages.) /index.html is the home page itself and carries a canonical link to /.
  // Stale leftovers (second-post.html, KW3.html, drafts/, main.tex) are intentionally NOT redirected.
});
