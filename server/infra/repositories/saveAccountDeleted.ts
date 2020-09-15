import { KnexPersist } from "../RepositoryPostgres";
import { AccountDeleted } from "../../domain";
import { pipe, constVoid } from "fp-ts/lib/function";
import { tryCatch } from "../FpUtils";
import * as TE from "fp-ts/lib/TaskEither";
import { InternalError } from "../../domain/interfaces";
import * as dao from "../orm/entities/events/AccountDeleted";
import { Account } from "../orm/entities/Account";

export const saveAccountDeleted: KnexPersist<AccountDeleted> = ({ em }) => (
  event
) =>
  pipe(
    tryCatch(() => em.save(dao.AccountDeleted.from(event))),
    TE.chain(() =>
      tryCatch(() => em.delete(Account, { id: event.aggregate.id }))
    ),
    TE.mapLeft(InternalError),
    TE.map(constVoid)
  );
