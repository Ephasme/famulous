import * as Knex from "knex";

const { DATABASE_URL } = process.env
if (!DATABASE_URL) {
  throw new Error("Missing environment variable: DATABASE_URL");
}

const knex = Knex({
  client: "postgres",
  connection: DATABASE_URL,
  migrations: {
    database: "knex_migrations",
    directory: "./server/infra/db/migrations"
  },
  pool: { min: 0, max: 4 },
});

knex.migrate.latest();

export default knex;
