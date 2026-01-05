# Philipp Kurrle's Website

Personal website built with [JBake](https://jbake.org/) and deployed to GitHub Pages.

## Building Locally

### Prerequisites
- Java 17 or later
- Maven 3.6+

### Build Commands

Generate the site:
```bash
mvn clean generate-resources
```

Or use JBake Maven plugin directly:
```bash
mvn jbake:generate
```

Preview the site locally:
```bash
mvn jbake:inline
```

The site will be generated in the `output/` directory.

## Deployment

This site is automatically deployed to GitHub Pages using GitHub Actions. Every push to the `main` (or `master`) branch triggers a build and deployment.

### Manual Deployment

You can also trigger a deployment manually from the GitHub Actions tab in your repository.

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
