require("dotenv").config()

const { DATABASE_URL } = process.env;

const config = {
  client: "postgresql",
  connection: DATABASE_URL,
  migrations: {
    database: "knex_migrations",
    directory: "./server/infra/db/migrations",
  },
};

module.exports = {
  development: config,
  production: config,
};
