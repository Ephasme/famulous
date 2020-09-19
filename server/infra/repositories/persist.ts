import {
  USER_CREATED,
  ACCOUNT_CREATED,
  ACCOUNT_DELETED,
  AnyEvent,
  TRANSACTION_CREATED,
} from "../../domain";
import { saveUserCreated } from "./saveUserCreated";
import {
  taskEither,
  mapLeft,
  map,
  chain,
  fromEither,
} from "fp-ts/lib/TaskEither";
import * as A from "fp-ts/lib/Array";
import { pipe, constVoid } from "fp-ts/lib/function";
import { saveAccountCreated } from "./saveAccountCreated";
import { tryCatch } from "../FpUtils";
import { saveAccountDeleted } from "./saveAccountDeleted";
import { saveTransactionCreated } from "./saveTransactionCreated";
import { AsyncResult, InternalError, Logger } from "../../domain/interfaces";
import { EntityManager } from "typeorm";

export type PersistDependencies = { em: EntityManager; logger: Logger };

const _persist = (deps: PersistDependencies) => (
  entity: AnyEvent
): AsyncResult<void> => {
  switch (entity.eventType) {
    case ACCOUNT_CREATED:
      return saveAccountCreated(deps)(entity);
    case USER_CREATED:
      return saveUserCreated(deps)(entity);
    case ACCOUNT_DELETED:
      return saveAccountDeleted(deps)(entity);
    case TRANSACTION_CREATED:
      return saveTransactionCreated(deps)(entity);
    default:
      throw new Error("Unhandled event");
  }
};

export default (deps: PersistDependencies) => (
  ...entities: AnyEvent[]
): AsyncResult<void> =>
  pipe(
    tryCatch(() =>
      // This returns a Promise that we need to catch and normalize.
      // Errors that arise here are problems while opening transaction.
      // Errors in 'persist' are turned into either.
      deps.em.transaction((
        trx // Conveniently, a transaction implements Knex.
      ) =>
        pipe(
          entities,
          A.map(_persist({ ...deps, em: trx })),
          A.sequence(taskEither)
        )()
      )
    ),
    // This gives back a Either<Error, Either<E, A>>.
    // We need to change the error into error with status.
    mapLeft((e) => {
      deps.logger.error(`error while opening transaction ${e.error.message}`);
      return e;
    }),
    // Changes the either into taskEither and flatten.
    chain(fromEither),
    map(constVoid)
  );
