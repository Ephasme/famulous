import * as Knex from "knex";

const { POSTGRES_URL } = process.env
if (!POSTGRES_URL) {
  throw new Error("Missing environment variable: POSTGRES_URL");
}

const knex = Knex({
  client: "postgres",
  connection: POSTGRES_URL,
  migrations: {
    database: "knex_migrations",
    directory: "./server/infra/db/migrations"
  },
  pool: { min: 0, max: 4 },
});

knex.migrate.latest();

export default knex;
