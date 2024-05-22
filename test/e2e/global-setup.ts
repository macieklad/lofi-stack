import { installGlobals } from '@remix-run/node';
import type { FullConfig } from '@playwright/test';
import { loadConfig } from "./utils";

loadConfig()
installGlobals()

async function globalSetup(config: FullConfig) {
  return config;
}

export default globalSetup;
