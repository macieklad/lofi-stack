import type { BrowserContext } from "@playwright/test";
import { parse } from "cookie";

import { createUser } from "~/models/user.server";
import {
  SESSION_COOKIE,
  createUserSession,
} from "~/session.server";

export async function createAndLogin({
  email,
  password = "secret",
  context,
}: {
  email: string;
  password?: string;
  context: BrowserContext;
}) {
  if (!email) {
    throw new Error("email required for login");
  }
  if (!email.endsWith("@example.com")) {
    throw new Error("All test emails must end in @example.com");
  }

  const user = await createUser({
    email,
    password
  });

  const response = await createUserSession({
    request: new Request("test://test"),
    userId: user.id,
    remember: false,
    redirectTo: "/",
  });

  const cookieValue = response.headers.get("Set-Cookie");
  if (!cookieValue) {
    throw new Error("Cookie missing from createUserSession response");
  }
  const parsedCookie = parse(cookieValue);

  context.addCookies([
    {
      name: SESSION_COOKIE,
      domain: "localhost",
      value: parsedCookie[SESSION_COOKIE],
      httpOnly: true,
      path: "/",
      sameSite: "Lax",
    },
  ]);
}
