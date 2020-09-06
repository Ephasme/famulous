import { Router } from "express";
import { Authenticator } from "../security/authenticate";
import { pipe } from "fp-ts/lib/function";
import {
  Commands,
  validateCreateAccountCommand,
  validateDeleteAccountCommand,
} from "./validators";
import { map, chain } from "fp-ts/lib/TaskEither";
import { foldToCreated, foldToUpdated } from "../responseFolders";
import { UserModel } from "../../infra/entities/UserModel";
import { Repository } from "../../infra/interfaces/Repository";

export default (repository: Repository, auth: Authenticator): Router => {
  const router = Router();

  router.delete("/", auth, (req, res) => {
    return pipe(
      validateDeleteAccountCommand(repository)(req.body),
      map(Commands.deleteToEvent),
      chain(repository.persist),
      foldToUpdated(res)
    );
  });

  router.post("/", auth, (req, res) => {
    return pipe(
      validateCreateAccountCommand(repository)(req.body),
      map(Commands.createToEvent),
      chain(repository.persist),
      foldToCreated(res)
    )();
  });

  router.get("/", auth, async (req, res) => {
    const user = req.user as UserModel;
    if (!user) {
      throw new Error("user not found");
    }

    const e = await repository.findAllAccounts(user.id)();

    if (e._tag === "Right") {
      res.json(e.right);
    } else {
      res.status(500); // TODO: functional programming
    }
  });

  return router;
};
