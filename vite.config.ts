/// <reference types="vitest" />
/// <reference types="vite/client" />
import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    remix({
      ignoredRouteFiles: ["**/.*", "**/*.test.{js,jsx,ts,tsx}"],
    }),
  ],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./test/unit/setup-test-env.ts"],
    include: ["./app/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    watchExclude: [
      ".*\\/node_modules\\/.*",
      ".*\\/build\\/.*",
      ".*\\/postgres-data\\/.*",
    ],
  }
});
