require("dotenv").config();

import {
  postgresHost,
  postgresPort,
  postgresUser,
  postgresPassword,
  postgresDatabase,
} from "./server/helpers/env";

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      port: postgresPort,
      host: postgresHost,
      database: postgresDatabase,
      user: postgresUser,
      password: postgresPassword,
    },
    migrations: {
      directory: "./server/db/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./server/db/seeds",
    },
  },
};
