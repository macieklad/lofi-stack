import dotenv from "dotenv";
import { fileURLToPath } from 'node:url';

export function loadConfig() {
  dotenv.config({ path: fileURLToPath(import.meta.resolve("../../.env.test", import.meta.url)) });
}
