import { defineConfig, devices } from '@playwright/test';
import type { PlaywrightTestConfig } from '@playwright/test';
import { API_BASE_URL } from './utils/constants';

/**
 * Configuração do Playwright para testes de API
 * @see https://playwright.dev/docs/test-configuration
 */
const config: PlaywrightTestConfig = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [
        ['github'],
        ['html', { outputFolder: 'playwright-report' }],
        ['list'],
        ['json', { outputFile: 'test-results/results.json' }],
        ['allure-playwright', { outputFolder: 'allure-results' }]
      ]
    : [
        ['html', { outputFolder: 'playwright-report' }],
        ['list'],
        ['json', { outputFile: 'test-results/results.json' }],
        ['allure-playwright', { outputFolder: 'allure-results' }]
      ],
  use: {
    baseURL: API_BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'api-tests',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  outputDir: 'test-results/',
});

export default config;

