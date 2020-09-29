import { AccountCreated } from "../../domain";
import { pipe, constVoid } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { tryCatch } from "../FpUtils";
import { AsyncResult, Logger } from "../../domain/interfaces";
import { EntityManager } from "typeorm";
import { AccountDao } from "../entities/Account";
import { AccountCreatedDao } from "../entities/Account/events/AccountCreatedDao";

export const saveAccountCreated = ({
  em,
  logger,
}: {
  em: EntityManager;
  logger: Logger;
}) => (event: AccountCreated): AsyncResult<void> =>
  pipe(
    tryCatch(() => em.save(AccountCreatedDao.from(event))),
    TE.map(() =>
      AccountDao.create({
        ...event.payload,
        id: event.aggregate.id,
        owners: [{ id: event.payload.userId }],
        createdAt: event.createdAt,
      })
    ),
    TE.chain((dao) => tryCatch(() => em.save(dao))),
    TE.map(constVoid)
  );
