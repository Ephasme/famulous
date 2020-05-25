import * as express from "express";
import * as Domain from "../domain";

const app = express();
const port = 3001;

app.get("/", (req, res) => res.send("Hello !"));

app.get("/api/give-me-something", (req, res) => {
  res.send({ value: "something" })
});

app.listen(port, () => console.log(`App started on port ${port}`));
