import persist from "./repositories/persist";
import { flow, pipe } from "fp-ts/lib/function";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import { tryCatch } from "./FpUtils";
import { Persist } from "../domain/Persist";
import {
  AccountId,
  AccountModel,
  AnyEvent,
  AnyId,
  Ledger,
  UserId,
  UserModel,
} from "../domain";
import { Repository, Logger } from "../domain/interfaces";
import {
  Connection,
  EntityManager,
  FindConditions,
  FindOneOptions,
  ObjectType,
} from "typeorm";
import { User } from "./entities/User";
import { Account } from "./entities/Account";
import { AsyncResult } from "../domain/interfaces/AsyncResult";
import { Transaction } from "./entities/Transaction";
import { TRANSACTIONS } from "./entities/AccountSQL";

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
  ) => (id: AnyId): AsyncResult<O.Option<Entity>> =>
    pipe(
      tryCatch(() =>
        this.em.findOne(entityClass, id.value, options).then(O.fromNullable)
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

  accountDaoToModel: (dao: Account) => AccountModel = (dao) => ({
    balance: dao.balance,
    currency: dao.currency,
    id: AccountId(dao.id),
    name: dao.name,
    state: dao.state,
    createdAt: dao.createdAt,
    transactions: pipe(
      dao.transactions || [],
      A.reduce<Transaction, Ledger>({}, (ledger, entry) => ({
        ...ledger,
        [entry.id]: {
          amount: entry.amount,
          createdAt: entry.createdAt,
          label: entry.label,
        },
      }))
    ),
  });

  findAllUsers = (): AsyncResult<UserModel[]> =>
    pipe(this.findAll(User), TE.map(A.map(this.userDaoToModel)));

  findAccountById = flow(
    this.findOneById(Account, {
      relations: [TRANSACTIONS],
    }),
    TE.map(O.map(this.accountDaoToModel))
  );

  findAllAccounts = (
    userId: UserId,
    { withTransactions }: { withTransactions: boolean } = {
      withTransactions: false,
    }
  ): AsyncResult<AccountModel[]> =>
    pipe(
      tryCatch(() => {
        const query = this.em
          .getRepository(Account)
          .createQueryBuilder("account")
          .leftJoin(`account.users`, "u")
          .where("u.id = :userId", { userId });
        if (withTransactions) {
          query.leftJoinAndSelect(`account.${TRANSACTIONS}`, "t");
        }
        return query.getMany();
      }),
      TE.map(A.map<Account, AccountModel>(this.accountDaoToModel))
    );
}
