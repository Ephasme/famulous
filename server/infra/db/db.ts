import * as Knex from "knex";

const instance: Knex | null = null;

export default async function (): Promise<Knex> {
  if (instance) return instance;

  const { DATABASE_URL } = process.env;
  if (!DATABASE_URL) {
    throw new Error("Missing environment variable: DATABASE_URL");
  }

  console.log(`creating db connection to ${DATABASE_URL}`)
  const knex = Knex({
    client: "postgres",
    connection: DATABASE_URL,
    migrations: {
      database: "knex_migrations",
      directory: "./server/infra/db/migrations",
    },
    pool: { min: 0, max: 4 },
  });

  console.log("migrating databases")
  await knex.migrate.latest();

  return knex
}
