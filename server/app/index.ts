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
import * as uuid from "uuid";
import { accountCreated, transactionCreated, userCreated } from "../domain";
import { Account } from "../infra/entities/Account";
// import { Transaction } from "../infra/orm/entities/Transaction";
// import { TransactionTarget } from "../infra/orm/entities/TransactionTarget";

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
  console.log(process.env.TYPEORM_URL);
  const cnx = await createConnection({
    type: "postgres",
    url: process.env.TYPEORM_URL,
    migrations: ["server/infra/migrations/**/*.ts"],
    entities: ["server/infra/entities/**/*.ts"],
    dropSchema: true,
    synchronize: true,
  });

  const em = cnx.createEntityManager();
  const repo = new RepositoryPostgres(logger, cnx, em);
  const passport = makePassportMiddleware(app, repo, logger);
  const auth = authenticatorFactory(passport);

  const userId = uuid.v4();
  await repo.persist(
    userCreated(userId, "admin@famulous.app", "password", "salt")
  )();
  const accountId = uuid.v4();
  await repo.persist(accountCreated(accountId, "account", userId, "EUR"))();
  const accountId2 = uuid.v4();
  await repo.persist(accountCreated(accountId2, "account2", userId, "EUR"))();
  const accountId3 = uuid.v4();
  await repo.persist(accountCreated(accountId3, "account3", userId, "EUR"))();
  const transactionId = uuid.v4();
  await repo.persist(
    transactionCreated(transactionId, accountId, [
      { accountId: accountId2, amount: 12 },
      { accountId: accountId3, amount: 2 },
    ])
  )();

  console.log(
    await cnx.getRepository(Account).findOne(accountId, {
      relations: ["transactions", "transactions.targets"],
    })
  );

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
