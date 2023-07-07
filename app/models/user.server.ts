import { db } from "~/config/db.server";
import bcrypt from "bcryptjs";
import type { Database } from "~/database/types";
import type { Insertable, Selectable } from "kysely";
const userPublicFields = ["id", "email", "created_at", "updated_at"] as const;

export type SelectableUser = Selectable<Database["users"]>;
export type InsertableUser = Insertable<Database["users"]>;
export type UserId = SelectableUser["id"];

export async function getUserById(id: UserId) {
  return await db
    .selectFrom("users")
    .select(userPublicFields)
    .where("id", "=", id)
    .executeTakeFirstOrThrow();
}

export async function getUserByEmail(email: SelectableUser["email"]) {
  return await db
    .selectFrom("users")
    .select(userPublicFields)
    .where("email", "=", email)
    .executeTakeFirst();
}

export async function createUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return await db
    .insertInto("users")
    .values({
      email,
      password: hashedPassword,
    })
    .returning(userPublicFields)
    .executeTakeFirstOrThrow();
}

export async function deleteUserByEmail(email: SelectableUser["email"]) {
  return db.deleteFrom("users").where("email", "=", email).execute();
}

export async function verifyLogin(
  email: SelectableUser["email"],
  password: string
) {
  const user = await db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();

  if (!user || !user.password) {
    return null;
  }

  const { password: hashedPassword, ...userFields } = user;

  const isValid = await bcrypt.compare(password, hashedPassword);

  if (!isValid) {
    return null;
  }

  return userFields;
}
