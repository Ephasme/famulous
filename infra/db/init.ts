import * as knex from "knex";

const conn = {
  port: 5432,
  host: "localhost",
  user: "admin",
  password: "example",
};

const knexClient = knex({ client: "postgres", connection: conn });

knexClient.raw("CREATE DATABASE famulous ").then(function () {
  knexClient.destroy();
});
