import {
  Repository,
  accountCreated,
  InternalError,
  OPENED_ACCOUNT,
  EMPTY_ACCOUNT,
  NotFound,
  accountDeleted,
} from "../../domain";
import { Router } from "express";
import { Authenticator } from "../security/authenticate";

import Logger from "../interfaces/Logger";
import { pipe } from "fp-ts/lib/function";
import {
  validateCreateAccountCommand,
  validateDeleteAccountCommand,
} from "./validators";
import {
  map,
  chain,
  fromEither,
  left,
  right,
  mapLeft,
} from "fp-ts/lib/TaskEither";
import { foldToResponse } from "../foldToResponse";
import { UserModel } from "../../infra/entities/UserModel";

export default (
  repository: Repository,
  logger: Logger,
  auth: Authenticator
): Router => {
  const router = Router();

  router.delete("/", auth, (req, res) => {
    return pipe(
      fromEither(validateDeleteAccountCommand(req.body)),
      chain((command) =>
        pipe(
          repository.findAccountById(command.id),
          chain((account) => {
            if (account.type !== EMPTY_ACCOUNT) {
              return right(account);
            }
            return left(NotFound("can't delete unexisting account"));
          }),
          map((account) => ({ account, command }))
        )
      ),
      map(({ account, command: { id } }) => {
        return {
          account,
          accountDeleted: accountDeleted(id),
        };
      }),
      chain(({ account, accountDeleted }) =>
        pipe(
          account.handleEvent(accountDeleted),
          fromEither,
          mapLeft(InternalError),
          map((newAccount) => ({ newAccount, accountDeleted })),
          chain(({ newAccount, accountDeleted }) => {
            if (newAccount.type !== EMPTY_ACCOUNT) {
              return left(
                InternalError("account should be deleted but wasn't")
              );
            }
            return right({ newAccount, accountDeleted });
          })
        )
      ),
      chain(({ accountDeleted }) =>
        pipe(
          repository.saveAll(accountDeleted),
          map(() => accountDeleted.id)
        )
      ),
      foldToResponse(res)
    );
  });

  router.post("/", auth, (req, res) => {
    return pipe(
      fromEither(validateCreateAccountCommand(req.body)),
      chain((command) =>
        pipe(
          repository.findAccountById(command.id),
          map((emptyAccount) => ({ command, emptyAccount }))
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
          map(() => ({
            id: openedAccount.id,
            name: openedAccount.name,
            type: openedAccount.type,
            currency: openedAccount.currency,
            balance: openedAccount.balance,
          }))
        )
      ),
      foldToResponse(res)
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
    }
  });

  return router;
};
