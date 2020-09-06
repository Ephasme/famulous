import { KnexPersistAny, Dependencies } from "../RepositoryPostgres";
import {
  USER_CREATED,
  ACCOUNT_CREATED,
  ACCOUNT_DELETED,
  AnyEvent,
  AccountCreated,
  UserCreated,
  UserModel,
  AccountDeleted,
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
import { tryCatchNormalize } from "../FpUtils";
import { saveAccountDeleted } from "./saveAccountDeleted";
import { Persist } from "../../domain/Persist";
import { AccountModel } from "../../domain/AccountModel";
import { AccountsToUsersModel } from "../entities/AccountsToUsersModel";
import { InternalError } from "../interfaces/Repository";

const saveUserModel = ({ knex }: Dependencies) => (event: UserCreated) => {
  return pipe(
    tryCatchNormalize(() =>
      knex<UserModel>("user")
        .insert({
          id: event.aggregate.id,
          email: event.payload.email,
          password: event.payload.password,
          salt: event.payload.salt,
          state: "active",
        })
        .then((x) => {
          console.log("inserted users: " + JSON.stringify(x));
        })
    ),
    mapLeft(InternalError),
    map(constVoid)
  );
};

const saveAccountModel = ({ knex }: Dependencies) => (
  event: AccountCreated | AccountDeleted
) => {
  switch (event.type) {
    case ACCOUNT_CREATED:
      return pipe(
        tryCatchNormalize(() =>
          knex<AccountModel>("account")
            .insert({
              id: event.aggregate.id,
              balance: 0,
              currency: event.payload.currency,
              name: event.payload.name,
              state: "opened",
            })
            .then((x) => console.log("inserted accounts: " + JSON.stringify(x)))
            .then(() =>
              knex<AccountsToUsersModel>("accounts_to_users").insert({
                account_id: event.aggregate.id,
                user_id: event.payload.userId,
              })
            )
            .then((x) => console.log("bound accounts: " + JSON.stringify(x)))
        ),
        mapLeft(InternalError),
        map(constVoid)
      );
    case ACCOUNT_DELETED:
      return pipe(
        tryCatchNormalize(() =>
          knex<AccountModel>("account").delete(event.aggregate.id)
        ),
        mapLeft(InternalError),
        map(constVoid)
      );
  }
};

export const _persist: KnexPersistAny = (deps) => (entity) => {
  console.log(`trying to save ${JSON.stringify(entity, null, 4)}`);
  switch (entity.type) {
    case ACCOUNT_CREATED:
      return pipe(
        saveAccountCreated(deps)(entity),
        chain(() => saveAccountModel(deps)(entity))
      );
    case USER_CREATED:
      return pipe(
        saveUserCreated(deps)(entity),
        chain(() => saveUserModel(deps)(entity))
      );
    case ACCOUNT_DELETED:
      return pipe(
        saveAccountDeleted(deps)(entity),
        chain(() => saveAccountModel(deps)(entity))
      );
    default:
      throw new Error("Unhandled event");
  }
};

export const persist: (deps: Dependencies) => Persist<AnyEvent> = (deps) => (
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
          A.map(_persist({ ...deps, knex: trx })),
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
