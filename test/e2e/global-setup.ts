import dotenv from 'dotenv'
import { installGlobals } from '@remix-run/node';
import type { FullConfig } from '@playwright/test';

dotenv.config()
installGlobals()

async function globalSetup(config: FullConfig) {
  return config;
}

export default globalSetup;