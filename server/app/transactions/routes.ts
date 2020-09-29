import { AccountId, transactionCreated, TransactionId } from "../../domain";
import { Router } from "express";
import { Authenticator } from "../security/authenticate";

import { pipe } from "fp-ts/lib/function";
import { validateCreateTransactionCommand } from "./validators";
import { map, chain, fromEither } from "fp-ts/lib/TaskEither";
import { Repository } from "../../domain/interfaces";
import { foldToCreated } from "../responseFolders";
import { x } from "@hapi/joi";

export default (repository: Repository, auth: Authenticator): Router => {
  const router = Router();

  router.post("/", auth, (req, res) => {
    return pipe(
      fromEither(validateCreateTransactionCommand(req.body)),
      map((x) => ({
        ...x,
        accountId: AccountId(x.accountId),
        id: TransactionId(x.id),
      })),
      //   chain((command) =>
      //     pipe(
      //       repository.findTransactionById(command.id),
      //       map((emptyTransaction) => ({ command, emptyTransaction }))
      //     )
      //   ), TODO: check if transaction doesn't exists yet + check if targetted accounts exists + check targetted accounts are owned by current user
      map(transactionCreated),
      chain(repository.persist),
      foldToCreated(res)
    )();
  });

  return router;
};
