import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import * as bodyParser from "body-parser";

import setupDb from "../infra/repositories/db";
import { RepositoryPostgres } from "../infra/RepositoryPostgres";
import { ConsoleLogger } from "../infra/ConsoleLogger";
import userRoutes from "./users/routes";
import accountRoutes from "./accounts/routes";
import securityRoutes from "./security/routes";
import makePassportMiddleware from "./security/passport";
import { authenticatorFactory } from "./security/authenticate";

const port = parseInt(process.env.PORT || "3001");

const logger = new ConsoleLogger();

setupDb(logger).then((db) => {
  const app = express();
  app.use(bodyParser.json());
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

  // Injection
  const repo = new RepositoryPostgres(db, logger);
  const passport = makePassportMiddleware(app, repo, logger);
  const auth = authenticatorFactory(passport);

  if (process.env.NODE_ENV === "production") {
    logger.info("Application started in production mode.");
    app.use(express.static(path.join(__dirname, "../../client/build")));
  }

  app.use("/api/v1/login", securityRoutes(repo, logger));
  app.use(
    "/api/v1/users",
    userRoutes(repo, logger, authenticatorFactory(passport))
  );
  app.use("/api/v1/accounts", accountRoutes(repo, logger, auth));

  app.listen(port, () => logger.info(`App started on port ${port}`));
});
