import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import {
  AccountId,
  AccountStates,
  ACCOUNT_STATES,
  UserId,
} from "../../../domain";
import { Timestamps } from "../../../domain/Timestamps";
import { TransactionDao } from "../Transaction";
import { UserDao } from "../User";

export * from "./events/AccountCreatedDao";
export * from "./events/AccountDeletedDao";

export const USERS = "users";
export const TRANSACTIONS = "transactions";
export const BALANCE = "balance";
export const ACCOUNTS_TABLE = "accounts";

export type CreateAccountParams = {
  id: AccountId;
  owners: NonEmptyArray<{ id: UserId }>;
  name: string;
  createdAt: Date;
  currency: string;
};

@Entity({ name: ACCOUNTS_TABLE })
export class AccountDao implements Timestamps {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  static create(params: CreateAccountParams): AccountDao {
    const account = new AccountDao();
    account.id = params.id.value;
    account.users = params.owners.map(({ id }) => {
      const u = new UserDao();
      u.id = id.value;
      return u;
    });
    account.createdAt = params.createdAt;
    account.balance = 0;
    account.currency = params.currency;
    account.name = params.name;
    account.state = "opened";
    return account;
  }

  @OneToMany(() => TransactionDao, (transaction) => transaction.account)
  [TRANSACTIONS]?: TransactionDao[];

  @ManyToMany(() => UserDao, (user) => user.accounts)
  [USERS]?: UserDao[];

  @Column({ enum: ACCOUNT_STATES })
  state!: AccountStates;

  @Column()
  name!: string;

  @Column()
  [BALANCE]!: number;

  @Column()
  createdAt!: Date;

  @Column({ nullable: true })
  updatedAt?: Date;

  @Column()
  currency!: string;
}
