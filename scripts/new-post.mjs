// Scaffold a new post: npm run new-post -- <slug> "<title>" [YYYY]
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const [slug, title, yearArg] = process.argv.slice(2);

if (!slug || !title) {
  console.error('usage: npm run new-post -- <slug> "<title>" [year]');
  process.exit(1);
}
if (!/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(slug)) {
  console.error('slug may only contain letters, digits, "-" and "_"');
  process.exit(1);
}

const now = new Date();
const year = yearArg ?? String(now.getFullYear());
const date = now.toISOString().slice(0, 10);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'src', 'content', 'blog', year);
const file = join(dir, `${slug}.md`);

if (existsSync(file)) {
  console.error(`already exists: ${file}`);
  process.exit(1);
}

const q = (s) => JSON.stringify(s);
mkdirSync(dir, { recursive: true });
writeFileSync(
  file,
  `---
title: ${q(title)}
date: ${date}
tags:
  - blog
draft: true
description: ""
---

`,
);
console.log(`created src/content/blog/${year}/${slug}.md (draft: true; set draft: false to publish)`);
