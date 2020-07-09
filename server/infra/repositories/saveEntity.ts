import { KnexPersistAny, Dependencies, SaveAll } from "../RepositoryPostgres";
import {
  USER_CREATED,
  EMPTY_USER,
  ACTIVE_USER,
  InternalError,
  ACCOUNT_CREATED,
  OPENED_ACCOUNT,
  EMPTY_ACCOUNT,
} from "../../domain";
import { saveUserCreated } from "./saveUserCreated";
import { saveActiveUser } from "./saveActiveUser";
import { taskEither, mapLeft, map, left } from "fp-ts/lib/TaskEither";
import * as A from "fp-ts/lib/Array";
import { pipe, constVoid } from "fp-ts/lib/function";
import { tryCatchNormalize } from "../FpUtils";
import { saveAccountCreated } from "./saveAccountCreated";
import { saveOpenedAccount } from "./saveOpenedAccount";

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
    case EMPTY_ACCOUNT:
    case EMPTY_USER:
      return left(InternalError("Can't save empty entity."));
  }
  return left(InternalError());
};

export const saveAll: (deps: Dependencies) => SaveAll = (deps) => (
  ...entities
) =>
  pipe(
    tryCatchNormalize(() =>
      deps.knex.transaction((trx) =>
        pipe(
          entities,
          A.map(persist({ ...deps, knex: trx })),
          A.sequence(taskEither),
          mapLeft((er) => {
            console.error(er.error.message);
            return er;
          })
        )()
      )
    ),
    //! this is buggy, the error from tryCatchNormalize is swallowed.
    //TODO: fix the swallowing
    mapLeft((x) => {
      console.error(x.message);
      return x;
    }),
    mapLeft(InternalError),
    map(constVoid)
  );
