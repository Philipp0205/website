import { url } from './url';

/**
 * Static HTML redirect page (GitHub Pages cannot send HTTP redirects).
 * `to` is a site-absolute path without base, e.g. "/about/".
 */
export function redirectPage(to: string, site: URL | undefined): Response {
  const target = url(to);
  const canonical = site ? new URL(target, site).href : target;
  const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>Weiterleitung zu: ${target}</title>
<meta http-equiv="refresh" content="0;url=${target}">
<meta name="robots" content="noindex">
<link rel="canonical" href="${canonical}">
</head>
<body>
<a href="${target}">Weiter zu ${target}</a>
</body>
</html>
`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}
