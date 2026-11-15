import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    ...devices['Desktop Chrome'],
  },
  // Serve the already-built dist/ under /website, like GitHub Pages does.
  webServer: {
    command: `node scripts/serve-dist.mjs ${PORT}`,
    url: `http://127.0.0.1:${PORT}/website/`,
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
