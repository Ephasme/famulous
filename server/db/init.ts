require("dotenv").config();
import * as knex from "knex";
import {
  postgresHost,
  postgresPort,
  postgresUser,
  postgresPassword,
  postgresDatabase,
} from "../helpers/env";

const connection = {
  port: postgresPort,
  host: postgresHost,
  user: postgresUser,
  password: postgresPassword,
};

const knexClient = knex({ client: "postgres", connection });

knexClient.raw(`CREATE DATABASE ${postgresDatabase}`).then(function () {
  knexClient.destroy();
});
