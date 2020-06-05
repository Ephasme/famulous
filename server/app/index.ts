import * as express from "express";
import * as path from "path";
import * as bodyParser from "body-parser";

import setupDb from "../infra/db/db";
import { RepositoryPostgres } from "../infra/RepositoryPostgres";
import { ConsoleLogger } from "../infra/ConsoleLogger";
import userRoutes from "./users/routes";
import securityRoutes from "./security/routes";
import makePassportMiddleware from "./security/passport";

const port = parseInt(process.env.PORT || "3001");

const logger = new ConsoleLogger();

setupDb(logger).then((db) => {
  const app = express();
  app.use(bodyParser.json());

  // Injection
  const repo = new RepositoryPostgres(db, logger);
  const passport = makePassportMiddleware(app, repo, logger);

  if (process.env.NODE_ENV === "production") {
    logger.info("Application started in production mode.");
    app.use(express.static(path.join(__dirname, "../../client/build")));
  }
  app.get("/api/give-me-something", (req, res) => {
    res.send({ value: "something" });
  });

  app.use(securityRoutes(repo, logger));
  app.use("/users", userRoutes(repo, logger));

  app.listen(port, () => logger.info(`App started on port ${port}`));
});
