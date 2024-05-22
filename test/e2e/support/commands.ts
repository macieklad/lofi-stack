import type { Page } from "@playwright/test";

const appHost = `http://localhost:${process.env.PORT || 3000}`;

export async function visitApp({ path, page }: { path: string; page: Page }) {
  await page.goto(`${appHost}${path}`);
}
