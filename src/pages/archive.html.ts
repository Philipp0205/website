import type { APIContext } from 'astro';
import { redirectPage } from '../lib/redirect';

// Old JBake URL /archive.html -> /archive/
export const GET = (context: APIContext) => redirectPage('/archive/', context.site);
