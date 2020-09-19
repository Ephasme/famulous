import { AccountDeleted } from "../../domain";
import { pipe, constVoid } from "fp-ts/lib/function";
import { tryCatch } from "../FpUtils";
import * as TE from "fp-ts/lib/TaskEither";
import { ErrorWithStatus, InternalError } from "../../domain/interfaces";
import * as dao from "../entities/events/AccountDeleted";
import { Account } from "../entities/Account";
import { PersistDependencies } from "./persist";

export const saveAccountDeleted = ({ em }: PersistDependencies) => (
  event: AccountDeleted
): TE.TaskEither<ErrorWithStatus, void> =>
  pipe(
    tryCatch(() => em.save(dao.AccountDeleted.from(event))),
    TE.chain(() =>
      tryCatch(() => em.delete(Account, { id: event.aggregate.id }))
    ),
    TE.map(constVoid)
  );
