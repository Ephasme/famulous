require("dotenv").config();
import { postgresDatabase } from "../helpers/env";
import { buildKnexClient } from "../helpers/db/clientInitialization";

const knexClient = buildKnexClient();

knexClient.raw(`CREATE DATABASE ${postgresDatabase}`).then(function () {
  knexClient.destroy();
});
