import type { APIContext } from 'astro';
import { redirectPage } from '../lib/redirect';

// Old JBake URL /about.html -> /about/
export const GET = (context: APIContext) => redirectPage('/about/', context.site);
