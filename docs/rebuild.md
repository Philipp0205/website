# astro rebuild plan

plan only. no code until this is ok'd.

## current state

jbake + pebble site in this repo, deployed from the committed `output/` folder (ci does not run jbake; it just uploads `output/` to github pages).

live url: https://philipp0205.github.io/website/
custom domain: none (no CNAME, pages `cname` is null). leave it that way.

source of truth:

- 1 published post: `content/blog/2025/KW2.md` (markdown)
- 1 draft: `drafts/KW3.md` (markdown, empty body; see open questions)
- 1 page: `content/about.html` (html body, jbake header)
- no asciidoc posts

jbake header fields in use:

- posts: `title`, `date` (yyyy-MM-dd), `type=post`, `tags` (comma list; only `blog` is used), `status` (`published` / intended `draft`), `summary`
- about: `title`, `date`, `type=page`, `status=published` (no tags, no summary)
- body starts after `~~~~~~`
- no `description` field; the template falls back to a hard-coded meta description
- `render.tags=false`, so tags render as chips only — no tag pages or `/tags/...` urls
- `render.sitemap=true`, `render.archive=true`, feed on by default

live url pattern (project site, base `/website/`): content path under `content/` is kept, extension becomes `.html`.

| kind | live path |
| --- | --- |
| home | `/website/` and `/website/index.html` |
| about | `/website/about.html` |
| archive | `/website/archive.html` |
| post | `/website/blog/2025/KW2.html` |
| rss | `/website/feed.xml` |
| sitemap | `/website/sitemap.xml` |

ui is german (`lang=de`, nav: blog / über mich / archiv / rss). the published post is english. no og/twitter tags. no dark mode. no custom 404. css is already a custom `modern.css` (css variables, no framework in the live templates); leftover bootstrap/jquery/prettify/asciidoctor assets are unused by the pebble templates. fonts come from google fonts (inter, fira code). `content/about/philipp.jpg` is 865kb.

deploy today: `.github/workflows/deploy.yml` on push to `main`/`master` + `workflow_dispatch`. permissions `contents:read`, `pages:write`, `id-token:write`. single job uploads `./output` with `actions/upload-pages-artifact` and `actions/deploy-pages`. pages source is "github actions".

mess worth knowing (does not change the migration rule, but affects redirects):

- `jbake.properties` still has `site.host=http://jbake.org`. the committed sitemap/feed were baked with `http://localhost:8820/` and double slashes (`http://localhost:8820//blog/2025/KW2.html`). feed title/description still say "JBake Bootstrap Template", language `en-gb`.
- `drafts/` sits outside `content/`, so a normal `jbake -b` would not see `KW3.md`. the file also has `status=published`, the same title/date/tags/summary as KW2, and an empty body.
- `output/` still contains stale files that **are live** because `output/` is what gets deployed: `/blog/2013/second-post.html` (deleted lorem ipsum sample), `/blog/2025/second-post.html` and `/blog/2025/KW3.html` and `/blog/drafts/KW3.html` (older wording of the KW2 post), `/drafts/KW3.html` (empty), `/main.tex` (old cv latex, source already deleted).
- footer github link and the about/hero github icon point at `https://github.com/philippkurrle`; this repo and the links inside KW2 use `Philipp0205`.
- readme is stale (says freemarker, and that `output/` is not committed). no LICENSE.md despite the readme pointer.

## target structure

astro, same repo, project pages under `/website/`.

```
astro.config.mjs          # site: 'https://philipp0205.github.io', base: '/website'
src/content.config.ts     # collections + zod frontmatter
src/content/blog/         # posts (md / mdx)
src/pages/index.astro
src/pages/about.astro     # or about.mdx; keep current html structure
src/pages/archive.astro
src/pages/blog/[...slug].astro
src/pages/tags/[tag].astro
src/pages/feed.xml.ts     # or rss.xml + redirect
src/styles/               # port modern.css, no ui framework
public/                   # favicon, CNAME if one is ever added (none now)
```

typed post frontmatter (zod):

- `title`: string
- `date`: date
- `tags`: string[] (default `[]`)
- `draft`: boolean (default `false`)
- `description`: string (from today's `summary`)

pages can stay as `.astro` / `.mdx` rather than a second collection if that stays simpler. markdown + mdx only.

## pages to build

- `/` hero + latest posts (same copy as today: "Hallo, ich bin Philipp …")
- `/about/` über mich, same text, photo, timeline, contact
- `/archive/` all published posts, grouped by month (german month names)
- `/blog/2025/KW2/` the one published post (slug keeps `KW2` casing)
- `/tags/blog/` and a tag page per future tag
- `/feed.xml` rss
- `/sitemap.xml` (`@astrojs/sitemap`)
- 404 page

nav stays: blog, über mich, archiv, rss.

## blog features

- rss (`@astrojs/rss`), sitemap, tag pages
- meta + open graph (title, description, canonical, og image — use the photo or a simple generated card)
- dark mode via `prefers-color-scheme` + a toggle that remembers the choice; extend the existing css variables
- lighthouse 95+ mobile: compress/resize `philipp.jpg`, self-host fonts, no jquery/bootstrap, keep js tiny
- minimal deps, no react/vue/svelte/etc.
- keep the current look (port `modern.css`), don't redesign

## url mapping and redirects

canonical urls drop `.html` and use a trailing slash (astro default). github pages is static, so astro `redirects` emit html redirect pages at the old paths. `base` is `/website` everywhere.

paths below are site-absolute; live they are prefixed by `/website`.

| old | new | strategy |
| --- | --- | --- |
| `/` | `/` | keep |
| `/index.html` | `/` | redirect |
| `/about.html` | `/about/` | redirect |
| `/archive.html` | `/archive/` | redirect |
| `/blog/2025/KW2.html` | `/blog/2025/KW2/` | redirect (this is the one real post url that must keep working) |
| `/feed.xml` | `/feed.xml` | keep path (even if generated by `@astrojs/rss`) |
| `/sitemap.xml` | `/sitemap.xml` | keep |
| `/tags/blog` (none today) | `/tags/blog/` | new, no redirect needed |

asset paths used in pages (`/about/philipp.jpg`, `/favicon.ico`) should keep working or redirect; prefer putting the photo in `public/about/philipp.jpg` so the old url still 200s.

stale live urls listed above are **not** real content. default: do not republish them; let them 404 once `output/` is gone. say if you want them redirected instead (see open questions).

## migration rule

- post and page text moves word for word. only the file format and frontmatter change (`summary` → `description`, `status=draft` → `draft: true`, `status=published` → `draft: false`, `tags` become a yaml list).
- drafts stay drafts and are not in the production build, feed, sitemap, or archive.
- do not "fix" wording, typo-hunt, or re-translate while migrating.
- `drafts/KW3.md` stays a draft even though its current `status=published` looks wrong; frontmatter should be corrected to `draft: true` and a real title once you say what it is.

## deploy

replace the jbake workflow with the official astro github pages workflow:

- https://docs.astro.build/en/guides/deploy/github/
- `.github/workflows/deploy.yml`: `withastro/action@v6` build job, then `actions/deploy-pages@v5`
- ci **builds** the site (no more committing generated html)
- pages stays on "github actions"; no CNAME/domain change
- `astro.config.mjs` must set `site: 'https://philipp0205.github.io'` and `base: '/website'` so css, links, canonicals, sitemap, and rss are correct (this also fixes today's localhost/jbake.org feed and sitemap)

## what gets dropped, and when

same pr as the rebuild, **after** a local/ci build is proven equal: every mapped old url either 200s at the new canonical or redirects there, published post body matches word for word, about/index/archive copy matches, feed and sitemap list the same published post with the real host.

drop in that pr:

- `jbake.properties`, `templates/` (`.peb` and unused `.ftl`)
- `output/` (generated html, stale leftovers, `main.tex`)
- unused default-template assets: bootstrap, jquery, html5shiv, prettify, asciidoctor css, glyphicon fonts, `assets/img/beach.jpg`, `content/about/jbake_logo.png`
- `PEBBLE_QUICK_REFERENCE.md`
- ide leftovers: `.vaadin/`, `.project`, `.settings/`

keep: `content` migrated into `src/content` / pages, the photo, favicon, the look of `modern.css`.

## tooling

- `npm run new-post` (or similar) scaffolds `src/content/blog/YYYY/slug.md` with the typed frontmatter
- readme: how to install, `npm run dev` / `build` / `preview`, how to add a post, how deploy works, live url
- `AGENTS.md`: short agent notes (collections, frontmatter, don't edit published wording casually, `base: '/website'`, `npm run check`)
- `scripts/check.sh`: `npm ci`, `astro check`, `astro build`, link check on `dist/`, playwright smoke (home, about, one post, archive, feed, plus one old `.html` url still redirects)

## open questions

1. `drafts/KW3.md` is empty, titled "Week 2 - 2025", dated 2025-01-11, and marked `status=published`. treat as a draft and leave the body empty until you write it?
2. stale live urls (`/blog/2013/second-post.html`, `/blog/2025/second-post.html`, `/blog/2025/KW3.html`, `/blog/drafts/KW3.html`, `/drafts/KW3.html`, `/main.tex`) — 404 (default) or redirect somewhere?
3. pretty urls + redirects (proposed) or keep exact `.html` paths as canonical so no redirect is needed?
4. footer/about github link is `github.com/philippkurrle`, but this repo and the KW2 project links are `Philipp0205`. which profile should the site use?
5. tag pages are new (tags are off today; the only tag is `blog`). ok to add?
6. no asciidoc in the repo. markdown/mdx only from here is ok?
