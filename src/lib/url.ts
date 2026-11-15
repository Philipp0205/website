// All internal URLs go through here so `base: '/website'` is always applied.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix a site-absolute path (e.g. "/about/") with the configured base. */
export function url(path: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export const GITHUB_URL = 'https://github.com/Philipp0205';
export const EMAIL = 'philippk@mailbox.org';
