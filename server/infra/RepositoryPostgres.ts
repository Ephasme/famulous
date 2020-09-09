import Knex = require("knex");
import Logger from "./interfaces/Logger";
import { persist } from "./repositories/saveEntity";
import { mapLeft, map } from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import * as A from "fp-ts/lib/Array";
import { tryCatchNormalize } from "./FpUtils";
import { AccountModel } from "../domain/AccountModel";
import { Persist, PersistAny } from "../domain/Persist";
import { AccountsToUsersModel } from "./entities/AccountsToUsersModel";
import { AnyEvent, UserModel } from "../domain";
import { Repository, InternalError } from "./interfaces/Repository";

export type UserFindParameters = Partial<{
  id: string;
  email: string;
}>;
export type FindParameters = UserFindParameters;

export type Dependencies = {
  knex: Knex<AnyEvent>;
  logger: Logger;
};

export type KnexPersistAny = (dependencies: Dependencies) => PersistAny;
export type KnexPersist<T extends AnyEvent> = (
  dependencies: Dependencies
) => Persist<T>;

export class RepositoryPostgres implements Repository {
  private dependencies: Dependencies;

  constructor(private knex: Knex, logger: Logger) {
    this.dependencies = { knex, logger };
    this.persist = persist(this.dependencies);
  }
  persist: Persist<AnyEvent>;

  findUserById = (id: string) =>
    pipe(
      tryCatchNormalize(() => this.knex<UserModel>("user").where({ id })),
      mapLeft(InternalError),
      map(A.head)
    );

  findUserByEmail = (email: string) =>
    pipe(
      tryCatchNormalize(() => this.knex<UserModel>("user").where({ email })),
      mapLeft(InternalError),
      map(A.head)
    );

  findAllUsers = () =>
    pipe(
      tryCatchNormalize(() => this.knex<UserModel>("user")),
      mapLeft(InternalError)
    );

  findAccountById = (id: string) =>
    pipe(
      tryCatchNormalize(() => this.knex<AccountModel>("account").where({ id })),
      mapLeft(InternalError),
      map(A.head)
    );

  findAllAccounts = (userId: string) =>
    pipe(
      tryCatchNormalize(() =>
        this.knex<AccountsToUsersModel>("accounts_to_users")
          .innerJoin("user", "user.id", "accounts_to_users.user_id")
          .innerJoin("account", "account.id", "accounts_to_users.account_id")
          .select<AccountModel[]>(["account.*"])
          .where({ "user.id": userId })
      ),
      mapLeft(InternalError)
    );
}
