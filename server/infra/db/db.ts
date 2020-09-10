import * as Knex from "knex";
import { Logger } from "../../domain/interfaces";

const instance: Knex | null = null;
const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
  throw new Error("Missing environment variable: DATABASE_URL");
}

export default async function (logger: Logger): Promise<Knex> {
  if (instance) return instance;

  logger.info(`creating db connection to ${DATABASE_URL}`);
  const knex = Knex({
    client: "postgres",
    connection: DATABASE_URL,
    pool: { min: 0, max: 4 },
  });

  return knex;
}
