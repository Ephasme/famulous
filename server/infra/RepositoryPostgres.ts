import persist from "./repositories/persist";
import { pipe, flow } from "fp-ts/lib/function";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import { tryCatch } from "./FpUtils";
import { Persist } from "../domain/Persist";
import { AccountModel, AnyEvent, UserModel } from "../domain";
import { Repository, InternalError, Logger } from "../domain/interfaces";
import { AdvancedConsoleLogger, Connection, EntityManager } from "typeorm";
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
      tryCatch(() =>
        this.em.findOne(Account, id, {
          relations: [
            "transactions",
            "transactions.targets",
            "transactions.targets.target",
          ],
        })
      ),
      TE.mapLeft(InternalError),
      TE.map((x) => {
        this.dependencies.logger.debug(JSON.stringify(x));
        return x;
      }),
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
            transactions: a.transactions.map((trx) => {
              return {
                targets: trx.targets.map((target) => {
                  return {
                    targetId: target.target.id,
                    amount: target.amount,
                    payee: target.payee,
                  };
                }),
              };
            }),
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
          //@ts-ignore
          A.map<Account, AccountModel>((a) => ({
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
