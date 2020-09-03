import { Repository, transactionCreated, InternalError } from "../../domain";
import { Router } from "express";
import { Authenticator } from "../security/authenticate";

import Logger from "../interfaces/Logger";
import { pipe } from "fp-ts/lib/function";
import { validateCreateTransactionCommand } from "./validators";
import { map, chain, fromEither } from "fp-ts/lib/TaskEither";
import { foldToResponse } from "../foldToResponse";

export default (repository: Repository, auth: Authenticator): Router => {
  const router = Router();

  router.post("/", auth, (req, res) => {
    return pipe(
      fromEither(validateCreateTransactionCommand(req.body)),
      //   chain((command) =>
      //     pipe(
      //       repository.findTransactionById(command.id),
      //       map((emptyTransaction) => ({ command, emptyTransaction }))
      //     )
      //   ), TODO: check if transaction doesn't exists yet + check if targetted accounts exists + check targetted accounts are owned by current user
      map((command) =>
        transactionCreated(command.id, command.account_id, command.targets)
      ),
      chain(repository.saveAll),
      foldToResponse(res)
    )();
  });

  return router;
};
