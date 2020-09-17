import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Timestamps } from "../../domain/Timestamps";
import { Account } from "./Account";
import { TransactionTarget } from "./TransactionTarget";

export type CreateTransactionParams = {
  id: string;
  account: Account;
  createdAt: Date;
  targets: TransactionTarget[];
};

@Entity()
export class Transaction implements Timestamps {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToMany(() => TransactionTarget, (target) => target.transaction, {
    cascade: true,
  })
  targets!: TransactionTarget[];

  static create(params: CreateTransactionParams): Transaction {
    const dao = new Transaction();
    dao.account = params.account;
    dao.createdAt = params.createdAt;
    dao.targets = params.targets;
    dao.id = params.id;
    return dao;
  }

  @ManyToOne(() => Account, (account) => account.transactions)
  @JoinTable()
  account!: Account;

  @Column()
  createdAt!: Date;

  @Column({ nullable: true })
  updatedAt?: Date;
}
