const { program } = require("commander");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

program
  .command("make:migration <name>")
  .description("Create a migration file")
  .action((name) => {
    console.log(`Creating migration ${name}`);
    copyStub(
      path.resolve(__dirname, "./stubs/migration.stub"),
      path.resolve(
        __dirname,
        `../app/database/migrations/${Date.now()}-${name}.ts`
      )
    );
    console.log(`Migration ${name} created inside app/database/migrations`);
  });

program
  .command("db:codegen")
  .description("Generate database kysely schema types")
  .action(() => execSubProgram("db", "codegen"));

program
  .command("db:migrate")
  .description("Generate database kysely schema types")
  .action(() => execSubProgram("db", "migrate"));

program
  .command("db:refresh")
  .description("Destroy all database tables and migrate fresh database")
  .action(() => execSubProgram("db", "refresh"));

program.parse();

function copyStub(from, to, variables = {}) {
  const stub = fs.readFileSync(from, "utf8");

  for (const [key, value] of Object.entries(variables)) {
    stub.replaceAll(`%${key}%`, value);
  }

  fs.writeFileSync(to, stub);
}

function execSubProgram(program, command) {
  execSync(`pnpm ts-node scripts/${program}.ts ${command}`, {
    stdio: "inherit",
  });
}
