import type { APIContext } from 'astro';
import { redirectPage } from '../../../lib/redirect';

// Old JBake URL /blog/2025/KW2.html -> /blog/2025/KW2/ (the one real post URL that must keep working)
export const GET = (context: APIContext) => redirectPage('/blog/2025/KW2/', context.site);
