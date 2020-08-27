import {
  Repository,
  USER,
  AnyUserStateType,
  ACTIVE_USER,
  ActiveUser,
  AnyEntity,
  EMPTY_USER,
  AnyUserState,
  AsyncResult,
  InternalError,
  EmptyUser,
  ErrorWithStatus,
  ACCOUNT,
  AnyAccountStateType,
  EmptyAccount,
  AnyAccountState,
  OPENED_ACCOUNT,
  OpenedAccount,
  EMPTY_ACCOUNT,
  AnyDomainType,
} from "../domain";
import Knex = require("knex");
import Logger from "../app/interfaces/Logger";
import { saveAll } from "./repositories/saveEntity";
import {
  mapLeft,
  map,
  chain,
  right,
  fromEither,
  flatten,
} from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { pipe, flow, constant, constVoid } from "fp-ts/lib/function";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { tryCatchNormalize } from "./FpUtils";

export type UserFindParameters = Partial<{
  id: string;
  email: string;
}>;

export type FindParameters = UserFindParameters;

export type UserModel = {
  id: string;
  state: AnyUserStateType;
  email: string;
  password: string;
  salt: string;
};

export type AccountModel = {
  id: string;
  state: AnyAccountStateType;
  name: string;
  balance: number;
  currency: string;
};

export type UserCreatedModel = {
  id: string;
  type: string;
  aggregate_id: string;
  aggregate_type: string;
  created_email?: string;
  created_password?: string;
  created_salt?: string;
};

export type AccountCreatedModel = {
  id: string;
  type: string;
  aggregate_id: string;
  aggregate_type: string;
  created_name: string;
  created_user_id: string;
  created_currency: string;
};

export type AccountDeletedModel = {
  id: string;
  type: string;
  aggregate_id: string;
  aggregate_type: string;
};

export type Dependencies = {
  knex: Knex<AnyEntity>;
  logger: Logger;
};

export type PersistAny = (entity: AnyEntity) => AsyncResult<void>;
export type Persist<T extends AnyEntity> = (entity: T) => AsyncResult<void>;
export type KnexPersistAny = (dependencies: Dependencies) => PersistAny;
export type KnexPersist<T extends AnyEntity> = (
  dependencies: Dependencies
) => Persist<T>;

export type SaveAll = (...entities: AnyEntity[]) => AsyncResult<void>;

namespace AccountModelUtils {
  export const modelToState = (
    account: AccountModel
  ): E.Either<ErrorWithStatus, AnyAccountState> => {
    switch (account.state) {
      case OPENED_ACCOUNT:
        return E.right(
          new OpenedAccount(
            account.id,
            account.name,
            account.currency,
            account.balance
          )
        );
      case EMPTY_ACCOUNT:
        return E.left(
          InternalError("Account state is corrupted, should not be empty.")
        );
    }
  };
  export const modelsToStates = (
    accounts: AccountModel[]
  ): E.Either<ErrorWithStatus, AnyAccountState[]> =>
    pipe(accounts, A.map(AccountModelUtils.modelToState), A.sequence(E.either));
}

namespace UserModelUtils {
  export const modelToState = (
    user: UserModel
  ): E.Either<ErrorWithStatus, AnyUserState> => {
    switch (user.state) {
      case ACTIVE_USER:
        return E.right(
          new ActiveUser(user.id, user.email, user.password, user.salt)
        );
      case EMPTY_USER:
        return E.left(
          InternalError(
            "User state is corrupted, should not be empty in database."
          )
        );
      default:
        return E.left(InternalError("Object unkown"));
    }
  };

  export const modelsToStates = (
    users: UserModel[]
  ): E.Either<ErrorWithStatus, AnyUserState[]> =>
    pipe(users, A.map(UserModelUtils.modelToState), A.sequence(E.either));
}

export class RepositoryPostgres implements Repository {
  private dependencies: Dependencies;

  constructor(private knex: Knex, logger: Logger) {
    this.dependencies = { knex, logger };
    this.saveAll = saveAll(this.dependencies);
  }

  private fetch = <T>(str: AnyDomainType, params: Record<string, any>) =>
    pipe(
      tryCatchNormalize(() => this.knex<T>(str).where(params)),
      mapLeft(InternalError)
    );

  private fetchOne = <T>(str: AnyDomainType, params: any) =>
    pipe(
      this.fetch<T>(str, params),
      map((x) => (x.length !== 1 ? O.none : O.some(x[0])))
    );

  private findUserBy = (params: { id: string } | { email: string }) =>
    pipe(
      this.fetchOne<UserModel>(USER, params),
      chain(
        O.fold(
          constant(right(new EmptyUser() as AnyUserState)),
          flow(UserModelUtils.modelToState, fromEither)
        )
      )
    );

  saveAll: SaveAll;

  findUserById = (id: string) => pipe({ id }, this.findUserBy);
  findUserByEmail = (email: string) => pipe({ email }, this.findUserBy);
  findAllUsers = pipe(
    tryCatchNormalize(() => this.knex<UserModel>(USER)),
    mapLeft(InternalError),
    map(UserModelUtils.modelsToStates),
    map(fromEither),
    flatten
  );

  private findAccountBy = (params: { id: string }) =>
    pipe(
      this.fetchOne<AccountModel>(ACCOUNT, params),
      chain(
        O.fold(
          constant(right(new EmptyAccount(params.id) as AnyAccountState)),
          flow(AccountModelUtils.modelToState, fromEither)
        )
      )
    );

  findAccountById = (id: string) => pipe({ id }, this.findAccountBy);
  findAllAccounts = pipe(
    tryCatchNormalize(() => this.knex<AccountModel>(ACCOUNT)),
    mapLeft(InternalError),
    map(AccountModelUtils.modelsToStates),
    map(fromEither),
    flatten
  );
}
