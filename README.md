# Philipp Kurrle's Website

Personal site built with [Astro](https://astro.build) (TypeScript, plain CSS) and deployed to GitHub Pages.

Live: https://philipp0205.github.io/website/

The site lives under the base path `/website`. There is no custom domain.

## Setup

Requires Node 22.23 or newer.

```bash
npm install
```

## Develop, build, preview

```bash
npm run dev       # dev server with hot reload, http://localhost:4321/website/
npm run build     # static site into dist/
npm run preview   # serve the built dist/ locally
```

## Checks

```bash
npm run check     # = ./scripts/check.sh
```

Runs, in order, and stops at the first failure: `npm ci`, `astro check`, `astro build`, an internal link check over `dist/` (`scripts/check-links.mjs`), and a Playwright smoke test (`tests/smoke.spec.ts`) against the built site served under `/website`.

The first time on a machine, Playwright needs a browser: `npx playwright install chromium`.

## Writing and publishing a post

Scaffold a post (creates a draft):

```bash
npm run new-post -- my-slug "My title"
```

This writes `src/content/blog/<year>/my-slug.md`:

```yaml
---
title: "My title"
date: 2025-01-11
tags:
  - blog
draft: true
description: ""
---
```

Write the body in Markdown. To publish, set `draft: false`, fill in `description`, commit, and merge to `main`. Posts with `draft: true` are kept out of the build, feed, sitemap, archive, and tag pages. The post URL is `/blog/<year>/<slug>/` (file name casing is kept).

## Projects

Add one entry to the array in `src/data/projects.ts`. No new page is needed. Descriptions that are empty or start with `TODO` are not shown. Only set `repo` if the repo is public.

## CV

`/cv/` exists but is empty and not in the nav. The typed data shape is in `src/data/cv.ts`. Content is added later, after review.

## Deployment

Pushes to `main` (or a manual run from the Actions tab) trigger `.github/workflows/deploy.yml`. It builds the site with `withastro/action` and publishes it with `actions/deploy-pages`. Build output (`dist/`) is never committed.

GitHub Pages must use **Settings > Pages > Source: GitHub Actions**.

## Project structure

- `src/content/blog/` posts (collection schema in `src/content.config.ts`)
- `src/data/` projects and CV data
- `src/pages/` routes, `src/layouts/`, `src/components/`
- `src/styles/global.css` styles (CSS variables, light and dark theme)
- `public/` static files (favicon, photo at `about/philipp.jpg`)
- `scripts/` check gate, link checker, post scaffold
- `docs/rebuild.md` plan for the Astro rebuild
