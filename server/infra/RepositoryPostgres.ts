import {
  Repository,
  USER,
  AnyEntity,
  AnyUserState,
  AsyncResult,
  InternalError,
  EmptyUser,
  ErrorWithStatus,
  EmptyAccount,
  AnyAccountState,
  AnyDomainType,
  NotFound,
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
  fold,
  fromOption,
  flatten,
} from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { pipe, flow, constant } from "fp-ts/lib/function";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { tryCatchNormalize } from "./FpUtils";
import { UserModel } from "./entities/UserModel";
import { AccountModel } from "../domain/AccountModel";
import { AccountsToUsersModel } from "./entities/AccountsToUsersModel";
import { Persist, PersistAny } from "../domain/Persist";

export type UserFindParameters = Partial<{
  id: string;
  email: string;
}>;
export type FindParameters = UserFindParameters;

export type Dependencies = {
  knex: Knex<AnyEntity>;
  logger: Logger;
};

export type KnexPersistAny = (dependencies: Dependencies) => PersistAny;
export type KnexPersist<T extends AnyEntity> = (
  dependencies: Dependencies
) => Persist<T>;

export type SaveAll = (...entities: AnyEntity[]) => AsyncResult<void>;

export const userModelsToStates = (
  users: UserModel[]
): E.Either<ErrorWithStatus, AnyUserState[]> =>
  pipe(users, A.map(UserModel.toState), A.sequence(E.either));

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
          flow(UserModel.toState, fromEither)
        )
      )
    );

  saveAll: SaveAll;

  findUserById = (id: string) => pipe({ id }, this.findUserBy);
  findUserByEmail = (email: string) => pipe({ email }, this.findUserBy);
  findAllUsers = pipe(
    tryCatchNormalize(() => this.knex<UserModel>(USER)),
    mapLeft(InternalError),
    map(userModelsToStates),
    map(fromEither),
    flatten
  );

  private findAccountBy = (params: { id: string }) =>
    pipe(
      tryCatchNormalize(() => {
        return Promise.all([
          this.knex<AccountModel>("account").where({ id: params.id }),
          this.knex<AccountsToUsersModel>("accounts_to_users").where({
            account_id: params.id,
          }),
        ]);
      }),
      mapLeft(InternalError),
      chain(([accounts, usersId]) => {
        return pipe(
          accounts,
          A.head,
          O.map((account) => ({
            account,
            usersId: usersId.map((x) => x.user_id),
          })),
          fromOption(NotFound)
        );
      }),
      fold(
        constant(right(new EmptyAccount(params.id) as AnyAccountState)),
        flow(AccountModel.toState, fromEither)
      )
    );

  findAccountById = (id: string) => pipe({ id }, this.findAccountBy);
  findAllAccounts = (userId: string) =>
    pipe(
      tryCatchNormalize(() =>
        this.knex
          .from("accounts_to_users")
          .innerJoin("user", "user.id", "accounts_to_users.user_id")
          .innerJoin("account", "account.id", "accounts_to_users.account_id")
          .select<AccountModel[]>(["account.*"])
          .where({ "user.id": userId })
      ),
      map((accounts) => {
        console.log(JSON.stringify(accounts));
        return accounts;
      }),
      mapLeft(InternalError)
    );
}
