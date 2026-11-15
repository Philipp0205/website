# AGENTS.md

Personal site of Philipp Kurrle. Astro + TypeScript + npm, static output on GitHub Pages.

- Live: https://philipp0205.github.io/website/
- `astro.config.mjs`: `site: 'https://philipp0205.github.io'`, `base: '/website'`. Every internal URL must go through `import.meta.env.BASE_URL` (see `src/lib/url.ts`). No custom domain, no CNAME.
- Verify with `npm run check` (= `./scripts/check.sh`). It runs `npm ci`, `astro check`, `astro build`, an internal link check over `dist/`, and a Playwright smoke test. It is the gate; do not report success without a full green run.

## Layout

- `src/content/blog/YYYY/slug.md`: posts (collection `blog`, schema in `src/content.config.ts`). Frontmatter: `title`, `date`, `tags` (yaml list), `draft`, `description`. Scaffold with `npm run new-post -- <slug> "<title>"`.
- `src/data/projects.ts`: typed project list. Adding a project is one array entry, not a new page.
- `src/data/cv.ts`: typed CV shape (experience, education, skills). Intentionally empty; `/cv/` is not in the nav.
- `src/pages/`: routes. `src/layouts/`, `src/components/`, `src/styles/global.css` (ported from the old `modern.css`; extend its CSS variables, do not redesign).
- `public/about/philipp.jpg`: compressed photo, keeps the old asset URL alive.
- `tests/smoke.spec.ts`, `scripts/check-links.mjs`: the check gate.

## Rules

- Published wording is not edited casually. Posts and the about page were migrated word for word; do not fix typos or translate.
- Do not invent CV or project copy. Empty/`TODO` project descriptions are not rendered.
- Drafts (`draft: true`) must stay out of build, feed, sitemap, archive, and tag pages. `2025/KW3` is an empty draft.
- Old stale URLs (`second-post.html`, `KW3.html`, `drafts/`, `main.tex`) must 404; no redirects for them.
- GitHub profile is `https://github.com/Philipp0205`.
- UI language is German (`lang="de"`).
- No analytics, trackers, comment widgets, UI frameworks, or runtime third-party requests (fonts are self-hosted).
- Do not commit `dist/`, `.astro/`, `node_modules/`, or `test-results/`. Do not push or change Pages/domain settings.
