import { session } from "remix-hono/session";
import { env } from "../env";
import { createCookieSessionStorage } from "@remix-run/node";

export function createSessionMiddleware() {
  return session({
    autoCommit: true,
    createSessionStorage() {
      if (!env.SESSION_SECRET) {
        throw new Error("SESSION_SECRET is not defined");
      }

      const sessionStorage = createCookieSessionStorage({
        cookie: {
          name: "session",
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secrets: [env.SESSION_SECRET],
          secure: env.NODE_ENV === "production",
        },
      });

      return {
        ...sessionStorage,
        // If a user doesn't come back to the app within 30 days, their session will be deleted.
        async commitSession(session) {
          return sessionStorage.commitSession(session, {
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });
        },
      };
    },
  })
}
