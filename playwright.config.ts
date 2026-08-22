import { defineConfig, devices } from '@playwright/test';

// Keep automated regression runs off-screen; opt into visible slow-motion
// debugging with PLAYWRIGHT_HEADED=1.
const headed = process.env.PLAYWRIGHT_HEADED === '1';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: {
    trace: 'on-first-retry',
    headless: !headed,
    launchOptions: {
      slowMo: headed ? 500 : 0,
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
