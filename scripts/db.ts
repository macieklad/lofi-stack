import * as path from 'path'
import { program } from 'commander'
import { promises as fs } from 'fs'
import { execSync } from 'child_process'
import type { Kysely } from 'kysely';
import {
  Migrator,
  FileMigrationProvider,
  sql,
} from 'kysely'
import dotenv from 'dotenv'

dotenv.config();
let dbInstance: Kysely<any>;
async function createDb() {
  if (!dbInstance) {
    dbInstance = (await import('../app/config/db.server')).db;
  }

  return dbInstance;
}

async function migrateToLatest() {
  const db = await createDb();
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, '../app/database/migrations'),
    }),
  })

  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('Failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

program.command('migrate')
  .description('Migrate the database by applying all pending migrations')
  .action(migrateToLatest)

program.command('refresh')
  .description('Refresh the database by dropping and recreating its default schema')
  .action(async () => {
  const db = await createDb();
  await sql`DROP SCHEMA IF EXISTS public CASCADE`.execute(db);
  await sql`CREATE SCHEMA public;`.execute(db);
  await sql`
    GRANT ALL ON SCHEMA public TO postgres;
    GRANT ALL ON SCHEMA public TO public;
  `.execute(db);
  await migrateToLatest();
  await codegen();
})

program
  .command("codegen")
  .description("Generate database kysely schema types")
  .action(() => codegen())

async function codegen() {
  execSync(
    `pnpm kysely-codegen --dialect postgres --out-file ${path.resolve(
      __dirname,
      "../app/database/types.ts"
    )}`,
    { stdio: "inherit" }
  );

  let generatedTypesContents = await fs.readFile(
    path.resolve(__dirname, "../app/database/types.ts"),
    "utf-8"
  );

  generatedTypesContents = generatedTypesContents.replace(/DB/g, "Database")

  await fs.writeFile(
    path.resolve(__dirname, "../app/database/types.ts"),
    generatedTypesContents
  )
}

program.parse();