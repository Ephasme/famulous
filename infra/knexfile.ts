module.exports = {
  development: {
    client: "postgresql",
    connection: {
      port: 5432,
      host: "localhost",
      database: "famulous",
      user: "admin",
      password: "example",
    },
    migrations: {
      directory: "./db/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
  },
};
