import * as express from "express";
import * as path from "path";

import userRoutes from "./users/routes";
import { buildKnexClient } from "../helpers/db/clientInitialization";
import { postgresDatabase } from "../helpers/env";

const knexClient = buildKnexClient(postgresDatabase);

const app = express();
const port = parseInt(process.env.PORT || "3001");

app.get("/api/give-me-something", (req, res) => {
  res.send({ value: "something" });
});

if (process.env.NODE_ENV === "production") {
  console.log("Application started in production mode.");
  app.use(express.static(path.join(__dirname, "../../client/build")));
}

app.use("/users", userRoutes(knexClient));

app.listen(port, () => console.log(`App started on port ${port}`));
