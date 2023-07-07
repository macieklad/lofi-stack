import type { UserId } from "./user.server";
import type { Insertable, Selectable } from "kysely";
import type { Database } from "~/database/types";
import { db } from "~/config/db.server";

export type SelectableNote = Selectable<Database["notes"]>;
export type InsertableNote = Insertable<Database["notes"]>;
export type NoteId = SelectableNote["id"];

export function getNote({ id, userId }: { id: NoteId; userId: UserId }) {
  return db
    .selectFrom("notes")
    .selectAll()
    .where(({ and, cmpr }) =>
      and([cmpr("id", "=", id), cmpr("user_id", "=", userId)])
    )
    .executeTakeFirstOrThrow();
}

export function getNoteListItems({ userId }: { userId: UserId }) {
  return db
    .selectFrom("notes")
    .selectAll()
    .where("user_id", "=", userId)
    .execute();
}

export function createNote({
  body,
  title,
  userId,
}: {
  body: InsertableNote["body"];
  title: InsertableNote["title"];
  userId: UserId;
}) {
  return db
    .insertInto("notes")
    .values({
      body,
      title,
      user_id: userId,
    })
    .returningAll()
    .executeTakeFirst();
}

export function deleteNote({ id, userId }: { id: NoteId; userId: UserId }) {
  return db
    .deleteFrom("notes")
    .where(({ and, cmpr }) =>
      and([cmpr("id", "=", id), cmpr("user_id", "=", userId)])
    )
    .execute();
}
