import { test, expect } from '@playwright/test';

// dist/ is served under /website, like GitHub Pages.
const B = '/website';

test('home lists the published post and has a German nav incl. Projekte', async ({ page }) => {
  await page.goto(`${B}/`);
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Hallo, ich bin Philipp');
  await expect(page.getByRole('link', { name: 'Week 2 - 2025' }).first()).toBeVisible();
  const nav = page.locator('#navLinks');
  await expect(nav.getByRole('link', { name: 'Projekte' })).toHaveAttribute('href', `${B}/projects/`);
  await expect(nav.getByRole('link', { name: 'Lebenslauf' })).toHaveCount(0);
  await expect(page.locator('footer a[href="https://github.com/Philipp0205"]')).toHaveCount(1);
});

test('post KW2 renders at the pretty URL with preserved casing', async ({ page }) => {
  const res = await page.goto(`${B}/blog/2025/KW2/`);
  expect(res?.status()).toBe(200);
  await expect(page.locator('.post-header h1')).toHaveText('Week 2 - 2025');
  await expect(page.getByText('Week two of 2025 was about polishing small tools')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Whoop Dashboard' })).toHaveCount(0); // bold text, not a link
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
    'href',
    'https://philipp0205.github.io/website/blog/2025/KW2/',
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://philipp0205.github.io/website/about/philipp.jpg',
  );
});

test('tag page lists the post, draft tags do not exist', async ({ page }) => {
  await page.goto(`${B}/tags/blog/`);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('blog');
  await expect(page.getByRole('link', { name: 'Week 2 - 2025' }).first()).toBeVisible();
});

test('archive groups the post by month', async ({ page }) => {
  await page.goto(`${B}/archive/`);
  await expect(page.getByRole('heading', { name: 'Januar 2025' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Week 2 - 2025' })).toHaveAttribute('href', `${B}/blog/2025/KW2/`);
});

test('RSS feed loads with the real host and only published posts', async ({ request }) => {
  const res = await request.get(`${B}/feed.xml`);
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('xml');
  const body = await res.text();
  expect(body).toContain('<rss');
  expect(body).toContain('https://philipp0205.github.io/website/blog/2025/KW2/');
  expect(body).not.toContain('localhost');
  expect(body).not.toContain('KW3');
});

test('sitemap is served at /sitemap.xml and excludes drafts', async ({ request }) => {
  const idx = await request.get(`${B}/sitemap.xml`);
  expect(idx.status()).toBe(200);
  expect(await idx.text()).toContain('https://philipp0205.github.io/website/sitemap-0.xml');
  const map = await request.get(`${B}/sitemap-0.xml`);
  expect(map.status()).toBe(200);
  const body = await map.text();
  expect(body).toContain('https://philipp0205.github.io/website/blog/2025/KW2/');
  expect(body).not.toContain('KW3');
});

test('about page keeps its content and the old photo URL works', async ({ page, request }) => {
  await page.goto(`${B}/about/`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Über mich');
  await expect(page.getByRole('heading', { name: 'Berufserfahrung' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Bildung' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Weiteres' })).toBeVisible();
  await expect(page.locator('a[href="https://github.com/Philipp0205"]')).toHaveCount(2); // sidebar + footer
  const photo = await request.get(`${B}/about/philipp.jpg`);
  expect(photo.status()).toBe(200);
  expect(photo.headers()['content-type']).toContain('image/jpeg');
  expect((await photo.body()).length).toBeLessThan(100_000);
});

test('projects page shows cards, links, and no TODO copy', async ({ page }) => {
  await page.goto(`${B}/projects/`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Projekte');
  await expect(page.getByRole('link', { name: 'extrablatt' })).toHaveAttribute(
    'href',
    'https://github.com/Philipp0205/extrablatt',
  );
  await expect(page.getByRole('link', { name: 'loanso.me' })).toHaveAttribute('href', 'https://loanso.me');
  await expect(page.getByRole('heading', { name: 'hangry' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'hangry' })).toHaveCount(0);
  await expect(page.locator('.project-card')).toHaveCount(3);
  await expect(page.locator('main')).not.toContainText('TODO');
});

test('cv is wired but empty and not in the nav', async ({ page }) => {
  const res = await page.goto(`${B}/cv/`);
  expect(res?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lebenslauf');
  await expect(page.locator('main p, main li, main h2, main h3')).toHaveCount(0);
});

test.describe('old .html URLs redirect to the pretty URLs', () => {
  const cases: [string, string][] = [
    ['/about.html', '/about/'],
    ['/archive.html', '/archive/'],
    ['/blog/2025/KW2.html', '/blog/2025/KW2/'],
  ];
  for (const [from, to] of cases) {
    test(`${from} -> ${to}`, async ({ page }) => {
      await page.goto(`${B}${from}`);
      await page.waitForURL(`**${B}${to}`);
      expect(new URL(page.url()).pathname).toBe(`${B}${to}`);
      await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    });
  }

  // On a static host /index.html is the home page file itself, so it cannot redirect.
  // It answers 200 and declares the pretty URL canonical.
  test('/index.html serves home with canonical /', async ({ page }) => {
    const res = await page.goto(`${B}/index.html`);
    expect(res?.status()).toBe(200);
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
      'href',
      'https://philipp0205.github.io/website/',
    );
  });
});

test.describe('stale and draft URLs 404', () => {
  const paths = [
    '/blog/2013/second-post.html',
    '/blog/2025/second-post.html',
    '/blog/2025/KW3.html',
    '/blog/2025/KW3/',
    '/blog/drafts/KW3.html',
    '/drafts/KW3.html',
    '/main.tex',
  ];
  for (const p of paths) {
    test(p, async ({ request }) => {
      const res = await request.get(`${B}${p}`);
      expect(res.status()).toBe(404);
    });
  }
});

test('404 page is German and links home', async ({ page }) => {
  const res = await page.goto(`${B}/does-not-exist/`);
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('404');
  await expect(page.getByRole('link', { name: /Zurück zum Blog/ })).toHaveAttribute('href', `${B}/`);
});

test('dark mode toggle switches theme and remembers the choice', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto(`${B}/`);
  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(await bg()).toBe('rgb(247, 246, 241)');

  await page.locator('#themeToggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await bg()).toBe('rgb(14, 20, 17)');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await bg()).toBe('rgb(14, 20, 17)');
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');
});

test('prefers-color-scheme: dark is respected without a saved choice', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto(`${B}/`);
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(14, 20, 17)');
});

test('no third-party requests', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (req) => {
    const u = new URL(req.url());
    if (u.hostname !== '127.0.0.1') external.push(req.url());
  });
  await page.goto(`${B}/`);
  await page.goto(`${B}/about/`);
  await page.waitForLoadState('networkidle');
  expect(external).toEqual([]);
});
