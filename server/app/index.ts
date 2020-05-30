import * as express from "express";
import * as path from "path";

import userRoutes from "./users/routes";
import setupDb from "../infra/db/db";

const app = express();
const port = parseInt(process.env.PORT || "3001");

setupDb().then((db) => {
  if (process.env.NODE_ENV === "production") {
    console.log("Application started in production mode.");
    app.use(express.static(path.join(__dirname, "../../client/build")));
  }
  app.get("/api/give-me-something", (req, res) => {
    res.send({ value: "something" });
  });
  app.use("/users", userRoutes(db));
  app.listen(port, () => console.log(`App started on port ${port}`));
});
