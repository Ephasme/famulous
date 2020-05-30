import * as Knex from "knex";

const instance: Knex | null = null;

export default async function (): Promise<Knex> {
  if (instance) return instance;

  const { DATABASE_URL } = process.env;
  if (!DATABASE_URL) {
    throw new Error("Missing environment variable: DATABASE_URL");
  }
  const migrations = process.env.NODE_ENV === "production"
    ? "./dist/infra/db/migrations"
    : "./server/infra/db/migrations"
       
  console.log(`creating db connection to ${DATABASE_URL}`);
  const knex = Knex({
    client: "postgres",
    connection: DATABASE_URL,
    migrations: {
      database: "knex_migrations",
      directory: migrations,
    },
    pool: { min: 0, max: 4 },
  });

  console.log("migrating databases");
  await knex.migrate.latest({
    
  });

  return knex;
}
