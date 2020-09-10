import Knex = require("knex");
import { persist } from "./repositories/saveEntity";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import * as A from "fp-ts/lib/Array";
import { tryCatchNormalize } from "./FpUtils";
import { Persist, PersistAny } from "../domain/Persist";
import { AccountsToUsersModel } from "./entities/AccountsToUsersModel";
import {
  AnyEvent,
  UserModel,
  AccountModel,
  AccountWithTransactionsModel,
} from "../domain";
import { Repository, InternalError, Logger } from "../domain/interfaces";
import { FindAccountByIdRawResult } from "./entities/FindAccountByIdRawResult";

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
      TE.mapLeft(InternalError),
      TE.map(A.head)
    );

  findUserByEmail = (email: string) =>
    pipe(
      tryCatchNormalize(() => this.knex<UserModel>("user").where({ email })),
      TE.mapLeft(InternalError),
      TE.map(A.head)
    );

  findAllUsers = () =>
    pipe(
      tryCatchNormalize(() => this.knex<UserModel>("user")),
      TE.mapLeft(InternalError)
    );

  findAccountById = (id: string) =>
    pipe(
      tryCatchNormalize(() =>
        this.knex("account")
          .innerJoin("transactions", "transaction.account_id", "account.id")
          .innerJoin(
            "transaction_to_target",
            "transaction_to_target.transaction_id",
            "transaction.id"
          )
          .select<FindAccountByIdRawResult[]>(
            "account.*",
            "transaction.id",
            "transaction_to_target.transaction_id",
            "transaction_to_target.account_id",
            "transaction_to_target.amount"
          )
          .where({ "account.id": id })
      ),
      TE.mapLeft(InternalError),
      // TODO: check results[0] exists
      TE.map((results) =>
        // TODO: reduce transactions then reduce account
        A.array.reduce<FindAccountByIdRawResult, AccountWithTransactionsModel>(
          results,
          {
            id: results[0]["account.id"],
            state: results[0]["account.state"],
            name: results[0]["account.name"],
            balance: results[0]["account.balance"],
            currency: results[0]["account.currency"],
            transactions: [],
          },
          (
            accumulator: AccountWithTransactionsModel,
            row
          ): AccountWithTransactionsModel => {
            // TODO: use Option
            const transaction = accumulator.transactions.find(
              (transac) => transac.id === row["transaction.id"]
            );
            const newTarget = {
              account_id: row["transaction_to_target.account_id"],
              amount: row["transaction_to_target.amount"],
            };

            let newTransaction;
            if (!transaction) {
              newTransaction = {
                id: row["transaction.id"],
                targets: [newTarget],
              };
            } else {
              newTransaction = {
                id: transaction.id,
                targets: [...transaction.targets, newTarget],
              };
            }

            const newValue = {
              ...accumulator,
              transactions: [...accumulator.transactions, {}],
            };

            return newValue;
          }
        )
      )
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
      TE.mapLeft(InternalError)
    );
}
