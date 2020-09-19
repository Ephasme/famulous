import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Account } from "./Account";
import { Transaction } from "./Transaction";

@Entity()
export class TransactionTarget {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Transaction, (transaction) => transaction.splits)
  @JoinTable()
  transaction!: Transaction;

  @Column()
  payee!: string;

  @ManyToOne(() => Account)
  @JoinTable()
  target!: Account;

  @Column()
  amount!: number;
}
