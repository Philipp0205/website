# Philipp Kurrle's Website

Personal website built with [JBake](https://jbake.org/) and deployed to GitHub Pages.

## Building Locally

### Using JBake CLI

Install JBake:
```bash
# Using SDKMAN
sdk install jbake

# Or download from https://jbake.org/download.html
```

Build the site:
```bash
jbake -b
```

Preview locally:
```bash
jbake -s
```

The site will be generated in the `output/` directory.

## Deployment

This site is automatically deployed to GitHub Pages. The `output/` directory is committed to the repository, and GitHub Actions deploys it directly.

### Workflow

1. Build your site locally with JBake
2. Commit the `output/` directory
3. Push to `main` or `master` branch
4. GitHub Actions automatically deploys to GitHub Pages

You can also trigger a deployment manually from the GitHub Actions tab.

## GitHub Pages Setup

To enable GitHub Pages for this repository:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The workflow will automatically deploy your site on the next push

Your site will be available at: `https://<username>.github.io/<repository-name>/`

## Project Structure

- `content/` - Blog posts and content pages
- `templates/` - Freemarker templates
- `assets/` - Static assets (CSS, JS, images)
- `output/` - Generated site (not committed to git)
- `jbake.properties` - JBake configuration

## License

See LICENSE.md
