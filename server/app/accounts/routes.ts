import { Router } from "express";
import { Authenticator } from "../security/authenticate";
import { pipe } from "fp-ts/lib/function";
import {
  Commands,
  validateCreateAccountCommand,
  validateDeleteAccountCommand,
  validateGetAccountCommand,
} from "./validators";
import * as TE from "fp-ts/lib/TaskEither";
import { foldToCreated, foldToUpdated, foldToOk } from "../responseFolders";
import { Repository, NotFound } from "../../domain/interfaces";
import { UserId, UserModel } from "../../domain";

export default (repository: Repository, auth: Authenticator): Router => {
  const router = Router();

  router.delete("/:id", auth, (req, res) => {
    return pipe(
      validateDeleteAccountCommand(repository)({ id: req.params.id }),
      TE.map(Commands.deleteToEvent),
      TE.chain(repository.persist),
      foldToUpdated(res)
    )();
  });

  router.post("/", auth, (req, res) => {
    return pipe(
      validateCreateAccountCommand(repository)(req.body),
      TE.map(Commands.createToEvent),
      TE.chain(repository.persist),
      foldToCreated(res)
    )();
  });

  router.get("/", auth, async (req, res) => {
    const user = req.user as UserModel;
    if (!user) {
      throw new Error("user not found");
    }

    const e = await repository.findAllAccounts(UserId(user.id))();

    if (e._tag === "Right") {
      res.json(e.right);
    } else {
      res.status(500); // TODO: functional programming
    }
  });

  router.get("/:id", auth, (req, res) => {
    return pipe(
      validateGetAccountCommand({ id: req.params.id }),
      TE.chain(({ id }) => repository.findAccountById(id)),
      TE.chain(TE.fromOption(() => NotFound("unexisting account"))),
      TE.map((daoModel) => ({
        ...daoModel,
        id: daoModel.id.value,
      })),
      foldToOk(res)
    )();
  });

  return router;
};
