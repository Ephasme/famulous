import * as express from "express";
import * as path from "path";
import * as bodyParser from "body-parser";

import userRoutes from "./users/routes";
import setupDb from "../infra/db/db";
import { RepositoryPostgres } from "../infra/RepositoryPostgres";

const port = parseInt(process.env.PORT || "3001");

setupDb().then((db) => {
  const app = express();
  app.use(bodyParser.json());

  // Injection
  const repo = new RepositoryPostgres(db);

  if (process.env.NODE_ENV === "production") {
    console.log("Application started in production mode.");
    app.use(express.static(path.join(__dirname, "../../client/build")));
  }
  app.get("/api/give-me-something", (req, res) => {
    res.send({ value: "something" });
  });
  app.use("/users", userRoutes(repo));
  app.listen(port, () => console.log(`App started on port ${port}`));
});
