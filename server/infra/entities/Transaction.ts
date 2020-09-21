import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AccountId, TransactionId } from "../../domain";
import { Account } from "./Account";
import { Allocation } from "./Allocation";
import { ACCOUNT, ALLOCATIONS, TRANSACTIONS_TABLE } from "./TransactionSQL";

export type CreateTransactionParams = {
  id: TransactionId;
  accountId: AccountId;
  amount: number;
  createdAt: Date;
  label?: string;
};

@Entity({ name: TRANSACTIONS_TABLE })
export class Transaction {
  static create(params: CreateTransactionParams): Transaction {
    const dao = new Transaction();
    dao.amount = params.amount;
    dao.account = { id: params.accountId.value } as Account;
    dao.id = params.id.value;
    dao.label = params.label;
    dao.createdAt = params.createdAt;
    return dao;
  }

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Account)
  @JoinTable()
  [ACCOUNT]!: Account;

  @OneToMany(() => Allocation, (a) => a.transaction)
  [ALLOCATIONS]?: Allocation[];

  @Column()
  amount!: number;

  @Column()
  createdAt!: Date;

  @Column({ nullable: true })
  label?: string;
}
