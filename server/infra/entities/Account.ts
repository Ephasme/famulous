import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AccountStates, ACCOUNT_STATES } from "../../domain";
import { Timestamps } from "../../domain/Timestamps";
import { ACCOUNTS, BALANCE, TRANSACTIONS, USERS } from "./AccountSQL";
import { Transaction } from "./Transaction";
import { User } from "./User";

export type CreateAccountParams = {
  id: string;
  owners: NonEmptyArray<{ id: string }>;
  name: string;
  createdAt: Date;
  currency: string;
};

@Entity({ name: ACCOUNTS })
export class Account implements Timestamps {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  static create(params: CreateAccountParams): Account {
    const account = new Account();
    account.id = params.id;
    account.users = params.owners.map(({ id }) => {
      const u = new User();
      u.id = id;
      return u;
    });
    account.createdAt = params.createdAt;
    account.balance = 0;
    account.currency = params.currency;
    account.name = params.name;
    account.state = "opened";
    return account;
  }

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  [TRANSACTIONS]?: Transaction[];

  @ManyToMany(() => User, (user) => user.accounts)
  [USERS]?: User[];

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
