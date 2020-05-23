import * as express from "express";
import * as Acc from "../../domain/src/account/states"

const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello !"));

app.post("/account/:id", (req, res) => {
    const acc = new Acc.OpenedAccount("someid", "somename")
    res.send(req.params.id)
})

app.listen(port, () => console.log(`App started on port ${port}`));
