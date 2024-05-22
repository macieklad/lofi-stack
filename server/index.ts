import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import {
  type AppLoadContext,
  type ServerBuild,
  Session,
} from "@remix-run/node";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { remix } from "remix-hono/handler";
import { getSession } from "remix-hono/session";
import { cache } from "./middlewares";
import { importDevBuild } from "./dev";
import { env } from "../env";
import { createSessionMiddleware } from "./session";

const mode = env.NODE_ENV === "test" ? "development" : env.NODE_ENV;

const isProductionMode = mode === "production";

const app = new Hono();

/**
 * Serve assets files from build/client/assets
 */
app.use(
  "/assets/*",
  cache(60 * 60 * 24 * 365), // 1 year
  serveStatic({ root: "./build/client" }),
);

/**
 * Serve public files
 */
app.use(
  "*",
  cache(60 * 60),
  serveStatic({ root: isProductionMode ? "./build/client" : "./public" }),
); // 1 hour

/**
 * Add logger middleware
 */
app.use("*", logger());

/**
 * Add session middleware (https://github.com/sergiodxa/remix-hono?tab=readme-ov-file#session-management)
 */
app.use(createSessionMiddleware());

/**
 * Add remix middleware to Hono server
 */
app.use(async (c, next) => {
  const build = (isProductionMode
    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line import/no-unresolved -- this expected until you build the app
      await import("../build/server/remix.js")
    : await importDevBuild()) as unknown as ServerBuild;

  return remix({
    build,
    mode,
    getLoadContext(c) {
      let session = getSession(c);

      return {
        session,
        appVersion: isProductionMode ? build.assets.version : "dev",
      } satisfies AppLoadContext;
    },
  })(c, next);
});

/**
 * Start the production server
 */

if (isProductionMode) {
  serve(
    {
      ...app,
      port: Number(env.PORT || 3000),
    },
    async (info) => {
      console.log(`🚀 Server started on port ${info.port}`);
    },
  );
}

export default app;

/**
 * Declare our loaders and actions context type
 */
declare module "@remix-run/node" {
  interface AppLoadContext {
    /**
     * The app version from the build assets
     */
    readonly appVersion: string;
    readonly session: Session;
  }
}
