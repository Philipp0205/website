export interface Project {
  /** Display name. */
  name: string;
  /** Public site or public repo. Omit when there is no public link. */
  url?: string;
  /** One-liner. Leave empty or start with "TODO" and it is not rendered. */
  description?: string;
  /** Only set when the repo is public. */
  repo?: string;
}

// Adding a project is one entry here, not a new page.
export const projects: Project[] = [
  {
    name: 'extrablatt',
    url: 'https://github.com/Philipp0205/extrablatt',
    description: 'TODO',
  },
  {
    name: 'loanso.me',
    url: 'https://loanso.me',
    description: 'TODO',
  },
  {
    // No public link yet (the repo is private).
    name: 'hangry',
    description: 'TODO',
  },
];

/** Descriptions that are empty or still TODO are not shown on the site. */
export function visibleDescription(project: Project): string | undefined {
  const text = project.description?.trim();
  if (!text || /^todo/i.test(text)) return undefined;
  return text;
}
