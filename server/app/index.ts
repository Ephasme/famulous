import "reflect-metadata";

import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import * as bodyParser from "body-parser";

import { RepositoryPostgres } from "../infra/RepositoryPostgres";
import { ConsoleLogger } from "../infra/ConsoleLogger";
import userRoutes from "./users/routes";
import accountRoutes from "./accounts/routes";
import transactionRoutes from "./transactions/routes";
import securityRoutes from "./security/routes";
import makePassportMiddleware from "./security/passport";
import { authenticatorFactory } from "./security/authenticate";
import { buildCreateUserFlow } from "./users/buildCreateUserFlow";
import { buildGetAllUsersFlow } from "./users/buildGetAllUsersFlow";
import { createConnection } from "typeorm";

const port = parseInt(process.env.PORT || "3001");

const logger = new ConsoleLogger();

Promise.resolve().then(async () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

  // Fundamental service instanciations.
  const cnx = await createConnection({
    type: "postgres",
    url: process.env.TYPEORM_URL,
    migrations: ["server/infra/migrations/**/*.ts"],
    entities: ["server/infra/entities/**/*.ts"],
    dropSchema: false,
    logging: false,
    synchronize: true,
  });

  const em = cnx.createEntityManager();
  const repo = new RepositoryPostgres(logger, cnx, em);
  const passport = makePassportMiddleware(app, repo, logger);
  const auth = authenticatorFactory(passport);

  // User flows injections.
  const userFlows = {
    createUserFlow: buildCreateUserFlow(repo, logger),
    getAllUsersFlow: buildGetAllUsersFlow(repo, logger),
  };

  if (process.env.NODE_ENV === "production") {
    logger.info("Application started in production mode.");
    app.use(express.static(path.join(__dirname, "../../client/build")));
  }

  app.use("/api/v1/login", securityRoutes(repo, logger));
  app.use("/api/v1/users", userRoutes(auth, userFlows));
  app.use("/api/v1/accounts", accountRoutes(repo, auth));
  app.use("/api/v1/transactions", transactionRoutes(repo, auth));

  app.listen(port, () => logger.info(`App started on port ${port}`));
});
