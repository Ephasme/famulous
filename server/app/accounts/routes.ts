import {
  Repository,
  accountCreated,
  InternalError,
  OPENED_ACCOUNT,
} from "../../domain";
import { Router } from "express";
import { Authenticator } from "../security/authenticate";

import Logger from "../interfaces/Logger";
import { pipe } from "fp-ts/lib/function";
import { validateCreateAccountCommand } from "./validators";
import {
  map,
  chain,
  fromEither,
  left,
  right,
  mapLeft,
  taskEither,
} from "fp-ts/lib/TaskEither";
import { foldToResponse } from "../foldToResponse";

export default (
  repository: Repository,
  logger: Logger,
  auth: Authenticator
): Router => {
  const router = Router();

  return router.post("/", auth, (req, res) => {
    return pipe(
      fromEither(validateCreateAccountCommand(req.body)),
      chain((command) =>
        pipe(
          repository.findAccountById(command.id),
          map((emptyAccount) => ({ command, emptyAccount })),
          map((x) => {
            console.log(x.emptyAccount.type);
            return x;
          })
        )
      ),
      map(({ emptyAccount, command }) => ({
        emptyAccount,
        accountCreated: accountCreated(
          command.id,
          command.name,
          command.user_id,
          command.currency
        ),
      })),
      chain(({ emptyAccount, accountCreated }) =>
        pipe(
          emptyAccount.handleEvent(accountCreated),
          fromEither,
          mapLeft(InternalError),
          map((account) => ({ account, accountCreated }))
        )
      ),
      chain(({ account, accountCreated }) => {
        if (account.type !== OPENED_ACCOUNT) {
          return left(InternalError("account is not opened"));
        }
        return right({ openedAccount: account, accountCreated });
      }),
      chain(({ openedAccount, accountCreated }) =>
        pipe(
          repository.saveAll(openedAccount, accountCreated),
          mapLeft((x) => {
            console.log(x.error.message);
            return x;
          }),
          map(() => {
            logger.info("saved account");
          }),
          map(() => openedAccount)
        )
      ),
      map((openedAccount) => {
        logger.info("account created");
        return {
          id: openedAccount.id,
          name: openedAccount.name,
          type: openedAccount.type,
          currency: openedAccount.currency,
          balance: openedAccount.balance,
        };
      }),
      foldToResponse(res)
    )();
  });
};
