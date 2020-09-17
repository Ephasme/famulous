import Knex = require("knex");
import { persist } from "./repositories/saveEntity";
import { pipe, flow } from "fp-ts/lib/function";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import { tryCatch } from "./FpUtils";
import { Persist, PersistAny } from "../domain/Persist";
import { AnyEvent, UserModel, UserStates, UserView } from "../domain";
import { Repository, InternalError, Logger } from "../domain/interfaces";
import { Connection, EntityManager } from "typeorm";
import { User } from "./entities/User";
import { Account } from "./entities/Account";

export type UserFindParameters = Partial<{
  id: string;
  email: string;
}>;
export type FindParameters = UserFindParameters;

export type Dependencies = {
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

  constructor(logger: Logger, cnx: Connection, private em: EntityManager) {
    this.dependencies = { logger, cnx, em };
    this.persist = persist(this.dependencies);
  }
  persist: Persist<AnyEvent>;

  findUserById = (id: string) =>
    pipe(
      tryCatch(() => this.em.findOne(User, id).then(O.fromNullable)),
      TE.mapLeft(InternalError)
    );

  findUserByEmail = (email: string) =>
    pipe(
      tryCatch(() =>
        this.em.findOne(User, { where: { email } }).then(O.fromNullable)
      ),
      TE.mapLeft(InternalError)
    );

  findAllUsers = () =>
    pipe(
      tryCatch(() => this.em.getRepository(User).find()),
      TE.map((daoList) =>
        daoList.map<UserModel>((dao) => {
          return {
            email: dao.email,
            id: dao.id,
            state: dao.state,
            password: dao.password,
            salt: dao.salt,
            createdAt: dao.createdAt,
          };
        })
      ),
      TE.mapLeft(InternalError)
    );

  findAccountById = (id: string) =>
    pipe(
      tryCatch(() => this.em.findOne(Account, id)),
      TE.mapLeft(InternalError),
      TE.map(O.fromNullable),
      TE.map(
        flow(
          O.map((a) => ({
            balance: a.balance,
            currency: a.currency,
            id: a.id,
            name: a.name,
            state: a.state,
            createdAt: a.createdAt,
          }))
        )
      )
    );

  findAllAccounts = (userId: string) =>
    pipe(
      tryCatch(() =>
        this.em
          .getRepository(Account)
          .createQueryBuilder("account")
          .leftJoinAndSelect("account.owners", "owner")
          .where("owner.id = :userId", { userId })
          .printSql()
          .getMany()
      ),
      TE.mapLeft(InternalError),
      TE.map(
        flow(
          A.map((a) => ({
            balance: a.balance,
            currency: a.currency,
            id: a.id,
            name: a.name,
            state: a.state,
            createdAt: a.createdAt,
          }))
        )
      )
    );
}
