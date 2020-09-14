import Knex = require("knex");
import { persist } from "./repositories/saveEntity";
import { pipe } from "fp-ts/lib/function";
import * as A from "fp-ts/lib/Array";
import * as TE from "fp-ts/lib/TaskEither";
import { tryCatch } from "./FpUtils";
import { Persist, PersistAny } from "../domain/Persist";
import { AccountsToUsersModel } from "./entities/AccountsToUsersModel";
import { AnyEvent, UserModel, AccountModel, UserStates } from "../domain";
import { Repository, InternalError, Logger } from "../domain/interfaces";
import { Connection, EntityManager } from "typeorm";
import { User } from "./orm/entities/User";

export type UserFindParameters = Partial<{
  id: string;
  email: string;
}>;
export type FindParameters = UserFindParameters;

export type Dependencies = {
  knex: Knex<AnyEvent>;
  cnx: Connection;
  logger: Logger;
  em: EntityManager;
};

export type KnexPersistAny = (dependencies: Dependencies) => PersistAny;
export type KnexPersist<T extends AnyEvent> = (
  dependencies: Dependencies
) => Persist<T>;

export class RepositoryPostgres implements Repository {
  private dependencies: Dependencies;

  constructor(
    private knex: Knex,
    logger: Logger,
    cnx: Connection,
    private em: EntityManager
  ) {
    this.dependencies = { knex, logger, cnx, em };
    this.persist = persist(this.dependencies);
  }
  persist: Persist<AnyEvent>;

  findUserById = (id: string) =>
    pipe(
      tryCatch(() => this.knex<UserModel>("user").where({ id })),
      TE.mapLeft(InternalError),
      TE.map(A.head)
    );

  findUserByEmail = (email: string) =>
    pipe(
      tryCatch(() => this.knex<UserModel>("user").where({ email })),
      TE.mapLeft(InternalError),
      TE.map(A.head)
    );

  findAllUsers = () =>
    pipe(
      tryCatch(() => this.em.getRepository(User).find()),
      TE.map((daoList) =>
        daoList.map<UserModel>((dao) => {
          return {
            email: dao.email,
            id: dao.id,
            state: dao.state as UserStates,
            password: dao.password,
            salt: dao.salt,
          };
        })
      ),
      TE.mapLeft(InternalError)
    );

  findAccountById = (id: string) =>
    pipe(
      tryCatch(() => this.knex<AccountModel>("account").where({ id })),
      TE.mapLeft(InternalError),
      TE.map(A.head)
    );

  findAllAccounts = (userId: string) =>
    pipe(
      tryCatch(() =>
        this.knex<AccountsToUsersModel>("accounts_to_users")
          .innerJoin("user", "user.id", "accounts_to_users.user_id")
          .innerJoin("account", "account.id", "accounts_to_users.account_id")
          .select<AccountModel[]>(["account.*"])
          .where({ "user.id": userId })
      ),
      TE.mapLeft(InternalError)
    );
}
