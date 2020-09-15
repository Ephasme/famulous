import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AccountStates, ACCOUNT_STATES } from "../../../domain";
import { Transaction } from "./Transaction";
// import { Transaction } from "./Transaction";
import { User } from "./User";

export type CreateAccountParams = {
  id: string;
  owners: NonEmptyArray<User>;
  name: string;
  currency: string;
};

@Entity()
export class Account {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions!: Transaction[];

  static create(params: CreateAccountParams): Account {
    const account = new Account();
    account.id = params.id;
    account.owners = params.owners;
    account.balance = 0;
    account.currency = params.currency;
    account.name = params.name;
    account.state = "opened";
    return account;
  }

  @ManyToMany(() => User, (user) => user.accounts)
  owners!: User[];

  @Column({ enum: ACCOUNT_STATES })
  state!: AccountStates;

  @Column()
  name!: string;

  @Column()
  balance!: number;

  @Column()
  currency!: string;
}
