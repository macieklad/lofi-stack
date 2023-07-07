import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  db.schema
    .createTable("users")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("email", "varchar(255)", (col) => col.unique().notNull())
    .addColumn("password", "varchar(255)")
    .addColumn("created_at", "timestamp", (col) => col.defaultTo("now()"))
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo("now()"))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
}
