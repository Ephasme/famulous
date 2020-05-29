import * as Knex from "knex";
import {
  postgresHost,
  postgresPort,
  postgresUser,
  postgresPassword,
} from "../env";

export const buildKnexClient = (database?: string): Knex => {
  const connection = {
    port: postgresPort,
    host: postgresHost,
    user: postgresUser,
    password: postgresPassword,
    database,
  };

  const knexClient = Knex({ client: "postgres", connection });
  return knexClient;
};
