import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Account } from "./Account";
import { ACCOUNT } from "./TransactionSQL";

export type CreateTransactionParams = {
  id: string;
  accountId: string;
  amount: number;
  createdAt: Date;
  description?: string;
  payee?: string;
};

@Entity()
export class Transaction {
  static create(params: CreateTransactionParams): Transaction {
    const dao = new Transaction();
    dao.amount = params.amount;
    dao.account = { id: params.accountId } as Account;
    dao.id = params.id;
    dao.payee = params.payee;
    dao.description = params.description;
    dao.createdAt = params.createdAt;
    return dao;
  }

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  payee?: string;

  @ManyToOne(() => Account)
  @JoinTable()
  [ACCOUNT]!: Account;

  @Column()
  amount!: number;

  @Column()
  createdAt!: Date;

  @Column({ nullable: true })
  description?: string;
}
