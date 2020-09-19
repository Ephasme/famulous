import persist from "./repositories/persist";
import { flow, pipe } from "fp-ts/lib/function";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import { tryCatch } from "./FpUtils";
import { Persist } from "../domain/Persist";
import { AccountModel, AnyEvent, UserModel } from "../domain";
import { Repository, InternalError, Logger } from "../domain/interfaces";
import {
  Connection,
  EntityManager,
  FindConditions,
  FindOneOptions,
  ObjectID,
  ObjectType,
} from "typeorm";
import { User } from "./entities/User";
import { Account } from "./entities/Account";
import { Transaction } from "./entities/Transaction";
import { AsyncResult } from "../domain/interfaces/AsyncResult";

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

export class RepositoryPostgres implements Repository {
  private dependencies: Dependencies;

  constructor(logger: Logger, cnx: Connection, private em: EntityManager) {
    this.dependencies = { logger, cnx, em };
    this.persist = persist(this.dependencies);
  }

  persist: Persist<AnyEvent>;

  findAll: <T>(entityClass: ObjectType<T>) => AsyncResult<T[]> = (
    entityClass
  ) => pipe(tryCatch(() => this.em.find(entityClass)));

  findOneById = <Entity>(
    entityClass: ObjectType<Entity>,
    options?: FindOneOptions<Entity>
  ) => (id: string | number | Date | ObjectID): AsyncResult<O.Option<Entity>> =>
    pipe(
      tryCatch(() =>
        this.em.findOne(entityClass, id, options).then(O.fromNullable)
      )
    );

  findOneByCriteria = <Entity>(
    entityClass: ObjectType<Entity>,
    options?: FindOneOptions<Entity>
  ) => (conditions: FindConditions<Entity>): AsyncResult<O.Option<Entity>> =>
    pipe(
      tryCatch(() =>
        this.em.findOne(entityClass, conditions, options).then(O.fromNullable)
      )
    );

  findUserByEmail = flow(
    (email: string) => ({ email }),
    this.findOneByCriteria(User)
  );

  findUserById = this.findOneById(User);
  findTransactionById = this.findOneById(Transaction);

  userDaoToModel: (dao: User) => UserModel = (dao) => ({
    email: dao.email,
    id: dao.id,
    state: dao.state,
    password: dao.password,
    salt: dao.salt,
    createdAt: dao.createdAt,
  });

  accountDaoToModel: (dao: Account) => AccountModel = (a) => ({
    balance: a.balance,
    currency: a.currency,
    id: a.id,
    name: a.name,
    state: a.state,
    createdAt: a.createdAt,
  });

  findAllUsers = (): AsyncResult<UserModel[]> =>
    pipe(this.findAll(User), TE.map(A.map(this.userDaoToModel)));

  findAccountById = this.findOneById(Account);

  findAllAccounts = (userId: string): AsyncResult<AccountModel[]> =>
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
      TE.map(A.map<Account, AccountModel>(this.accountDaoToModel))
    );
}
