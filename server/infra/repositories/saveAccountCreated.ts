import { KnexPersist } from "../RepositoryPostgres";
import { AccountCreated } from "../../domain";
import { pipe, constVoid } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { tryCatch } from "../FpUtils";
import { InternalError } from "../../domain/interfaces";
import * as dao from "../entities/events/AccountCreated";
import { Account } from "../entities/Account";
import { User } from "../entities/User";

export const saveAccountCreated: KnexPersist<AccountCreated> = ({ em }) => (
  event
) =>
  pipe(
    tryCatch(() => em.save(dao.AccountCreated.from(event))),
    TE.map(() =>
      Account.create({
        ...event.payload,
        id: event.aggregate.id,
        owners: [{ id: event.payload.userId }],
        createdAt: event.createdAt,
      })
    ),
    TE.chain((dao) => tryCatch(() => em.save(dao))),
    TE.mapLeft(InternalError),
    TE.map(constVoid)
  );
