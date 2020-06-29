import { KnexPersistAny, Dependencies, SaveAll } from "../RepositoryPostgres";
import {
  USER_CREATED,
  EMPTY_USER,
  ACTIVE_USER,
  InternalError,
} from "../../domain";
import { saveUserCreated } from "./saveUserCreated";
import { saveActiveUser } from "./saveActiveUser";
import { taskEither, mapLeft, map, left } from "fp-ts/lib/TaskEither";
import * as A from "fp-ts/lib/Array";
import { pipe, constVoid } from "fp-ts/lib/function";
import { tryCatchNormalize } from "../FpUtils";

export const persist: KnexPersistAny = (deps) => (entity) => {
  console.log(`trying to save ${JSON.stringify(entity, null, 4)}`);
  switch (entity.type) {
    case USER_CREATED:
      return saveUserCreated(deps)(entity);
    case EMPTY_USER:
      return left(InternalError("Can't save empty user."));
    case ACTIVE_USER:
      return saveActiveUser(deps)(entity);
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
          A.sequence(taskEither)
        )()
      )
    ),
    mapLeft(InternalError),
    map(constVoid)
  );
