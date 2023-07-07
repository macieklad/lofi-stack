import type { Page } from '@playwright/test';

const appHost = `http://localhost:${process.env.PORT || 3000}`;

export function visitApp({
  path,
  page
}: {
  path: string;
  page: Page
}) {
  page.goto(`${appHost}${path}`)
}