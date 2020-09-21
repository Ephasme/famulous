import { AccountDeleted } from "../../domain";
import { pipe, constVoid } from "fp-ts/lib/function";
import { tryCatch } from "../FpUtils";
import * as TE from "fp-ts/lib/TaskEither";
import { ErrorWithStatus } from "../../domain/interfaces";
import { PersistDependencies } from "./persist";
import { AccountDao, AccountDeletedDao } from "../entities/Account";

export const saveAccountDeleted = ({ em }: PersistDependencies) => (
  event: AccountDeleted
): TE.TaskEither<ErrorWithStatus, void> =>
  pipe(
    tryCatch(() => em.save(AccountDeletedDao.from(event))),
    TE.chain(() =>
      tryCatch(() => em.delete(AccountDao, { id: event.aggregate.id }))
    ),
    TE.map(constVoid)
  );
