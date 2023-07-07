import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  db.schema
    .createTable("notes")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("title", "varchar(255)", (col) => col.notNull())
    .addColumn("body", "text")
    .addColumn("user_id", "integer", (col) =>
      col.notNull().references("users.id")
    )
    .addColumn("created_at", "timestamp", (col) => col.defaultTo("now()"))
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo("now()"))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
}
