import { KnexPersistAny, Dependencies, SaveAll } from "../RepositoryPostgres";
import {
  USER_CREATED,
  EMPTY_USER,
  ACTIVE_USER,
  InternalError,
} from "../../domain";
import { saveUserCreated } from "./saveUserCreated";
import { saveActiveUser } from "./saveActiveUser";
import { tryCatchNormalize } from "../FpUtils";
import { mapLeft, map } from "fp-ts/lib/TaskEither";
import { pipe, constVoid } from "fp-ts/lib/function";
import * as A from "fp-ts/lib/Array";

export const persist: KnexPersistAny = (deps) => (entity) => {
  console.log(`trying to save ${JSON.stringify(entity, null, 4)}`);
  switch (entity.type) {
    case USER_CREATED:
      return saveUserCreated(deps)(entity);
    case EMPTY_USER:
      throw new Error("Can't save empty user.");
    case ACTIVE_USER:
      return saveActiveUser(deps)(entity);
  }
  throw new Error("Object unkown");
};

export const saveAll: (deps: Dependencies) => SaveAll = (deps) => (
  ...entities
) => {
  const x = deps.knex.transaction((trx) => {
    // entities.map(persist({ ...deps, knex: trx }))
  });
  // pipe(
  //   mapLeft(InternalError),
  //   map((x) => {
  //     deps.logger.info("entities saved");
  //     return x;
  //   }),
  //   map(constVoid)
  // );
  throw "???";
};
