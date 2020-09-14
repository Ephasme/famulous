import "reflect-metadata";

import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import * as bodyParser from "body-parser";

import setupDb from "../infra/db/db";
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
import { User } from "../infra/orm/entities/User";
import { Account } from "../infra/orm/entities/Account";
import * as uuid from "uuid";
import { userCreated, userDeleted } from "../domain";
// import { Transaction } from "../infra/orm/entities/Transaction";
// import { TransactionTarget } from "../infra/orm/entities/TransactionTarget";

const port = parseInt(process.env.PORT || "3001");

const logger = new ConsoleLogger();

setupDb(logger).then(async (db) => {
  const app = express();
  app.use(bodyParser.json());
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

  // Fundamental service instanciations.
  console.log(process.env.TYPEORM_URL);
  const cnx = await createConnection({
    type: "postgres",
    url: process.env.TYPEORM_URL,
    migrations: ["server/infra/orm/migrations/**/*.ts"],
    entities: ["server/infra/orm/entities/**/*.ts"],
    dropSchema: true,
    synchronize: true,
  });

  const em = cnx.createEntityManager();
  const repo = new RepositoryPostgres(db, logger, cnx, em);
  const passport = makePassportMiddleware(app, repo, logger);
  const auth = authenticatorFactory(passport);

  await repo.persist(
    userCreated(uuid.v4(), "admin@famulous.app", "password", "salt")
  )();

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
