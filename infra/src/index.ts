import * as express from "express";
import { AnyAccountEvent, created as accountCreated} from "../../domain/src/account";

const ev = accountCreated("someid", "bla")

function bla(ev: AnyAccountEvent) {
    if (ev.name === "account.created") {
        ev.payload.name
    }
}

const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello !"));

app.listen(port, () => console.log(`App started on port ${port}`));
