import * as express from "express";
import * as path from "path"

const app = express();
const port = parseInt(process.env.PORT || "3001");

app.get("/api/give-me-something", (req, res) => {
  res.send({ value: "something" })
});

if (process.env.NODE_ENV === "production") {
  console.log('Application started in production mode.')
  app.use(express.static(path.join(__dirname, '../../client/build')))
}

app.listen(port, () => console.log(`App started on port ${port}`));
