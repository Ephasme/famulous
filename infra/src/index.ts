import * as express from "express";
import * as Ac from "../../domain/src"


const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello !"));

app.listen(port, () => console.log(`App started on port ${port}`));
