import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Account } from "./Account";
import { Transaction } from "./Transaction";

@Entity()
export class TransactionTarget extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Transaction, (x) => x.targets)
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
