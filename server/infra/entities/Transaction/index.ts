import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AccountId, TransactionId } from "../../../domain";
import { AccountDao } from "../Account";
import { AllocationDao } from "../Allocation";

export * from "./events/TransactionCreatedDao";

export const ACCOUNT = "account";
export const ALLOCATIONS = "allocations";
export const TRANSACTIONS_TABLE = "transactions";

export type CreateTransactionParams = {
  id: TransactionId;
  accountId: AccountId;
  amount: number;
  createdAt: Date;
  label?: string;
};

@Entity({ name: TRANSACTIONS_TABLE })
export class TransactionDao {
  static create(params: CreateTransactionParams): TransactionDao {
    const dao = new TransactionDao();
    dao.amount = params.amount;
    dao.account = { id: params.accountId.value } as AccountDao;
    dao.id = params.id.value;
    dao.label = params.label;
    dao.createdAt = params.createdAt;
    return dao;
  }

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => AccountDao)
  @JoinTable()
  [ACCOUNT]!: AccountDao;

  @OneToMany(() => AllocationDao, (a) => a.transaction)
  [ALLOCATIONS]?: AllocationDao[];

  @Column()
  amount!: number;

  @Column()
  createdAt!: Date;

  @Column({ nullable: true })
  label?: string;
}
