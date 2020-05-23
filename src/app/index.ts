import * as express from "express";
import * as Domain from "../../domain/src"

const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello !"));

app.post("/account/:id", (req, res) => {
    const acc = new Domain.OpenedAccount("someid", "somename")
    const ev = Domain.accountCreated("someId", "someName")
    const nextState = acc.handleEvent(ev)

    res.send(req.params.id)
})

app.listen(port, () => console.log(`App started on port ${port}`));
