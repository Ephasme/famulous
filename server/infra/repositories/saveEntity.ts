import { KnexPersistAny, Dependencies, SaveAll } from "../RepositoryPostgres";
import {
  USER_CREATED,
  EMPTY_USER,
  ACTIVE_USER,
  InternalError,
  ACCOUNT_CREATED,
  OPENED_ACCOUNT,
  EMPTY_ACCOUNT,
  ACCOUNT_DELETED,
} from "../../domain";
import { saveUserCreated } from "./saveUserCreated";
import { saveActiveUser } from "./saveActiveUser";
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
import { saveOpenedAccount } from "./saveOpenedAccount";
import { tryCatchNormalize } from "../FpUtils";
import { saveEmptyAccount } from "./saveEmptyAccount";
import { saveAccountDeleted } from "./saveAccountDeleted";

export const persist: KnexPersistAny = (deps) => (entity) => {
  console.log(`trying to save ${JSON.stringify(entity, null, 4)}`);
  switch (entity.type) {
    case ACCOUNT_CREATED:
      return saveAccountCreated(deps)(entity);
    case OPENED_ACCOUNT:
      return saveOpenedAccount(deps)(entity);
    case USER_CREATED:
      return saveUserCreated(deps)(entity);
    case ACTIVE_USER:
      return saveActiveUser(deps)(entity);
    case ACCOUNT_DELETED:
      return saveAccountDeleted(deps)(entity);
    case EMPTY_ACCOUNT:
      return saveEmptyAccount(deps)(entity);
    case EMPTY_USER:
      throw new Error("not handled");
  }
};

export const saveAll: (deps: Dependencies) => SaveAll = (deps) => (
  ...entities
) =>
  pipe(
    tryCatchNormalize(() =>
      // This returns a Promise that we need to catch and normalize.
      // Errors that arise here are problems while opening transaction.
      // Errors in 'persist' are turned into either.
      deps.knex.transaction((
        trx // Conveniently, a transaction implements Knex.
      ) =>
        pipe(
          entities,
          A.map(persist({ ...deps, knex: trx })),
          A.sequence(taskEither)
        )()
      )
    ),
    // This gives back a Either<Error, Either<E, A>>.
    // We need to change the error into error with status.
    mapLeft((e) => {
      deps.logger.error(`error while opening transaction ${e.message}`);
      return InternalError(e);
    }),
    // Changes the either into taskEither and flatten.
    chain(fromEither),
    map(constVoid)
  );
