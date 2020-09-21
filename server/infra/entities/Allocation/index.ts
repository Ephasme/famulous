import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AllocationId, EnveloppeId, TransactionId } from "../../../domain";
import { EnveloppeDao } from "../Enveloppe";
import { TransactionDao } from "../Transaction";

export const ALLOCATIONS_TABLE = "allocations";
export const TRANSACTION = "transaction";
export const ENVELOPPE = "enveloppe";

export type CreateAllocationParams = {
  id: AllocationId;
  enveloppeId: EnveloppeId;
  transactionId: TransactionId;
  amount: number;
  createdAt: Date;
  description?: string;
  payee?: string;
};

@Entity({ name: ALLOCATIONS_TABLE })
export class AllocationDao {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  static from(params: CreateAllocationParams): AllocationDao {
    const dao = new AllocationDao();
    dao.enveloppe = { id: params.enveloppeId.value } as EnveloppeDao;
    dao.transaction = { id: params.transactionId.value } as TransactionDao;
    dao.amount = params.amount;
    dao.createdAt = params.createdAt;
    dao.description = params.description;
    dao.id = params.id.value;
    dao.payee = params.payee;
    return dao;
  }

  @ManyToOne(() => TransactionDao, (t) => t.allocations)
  @JoinColumn()
  [TRANSACTION]!: TransactionDao;

  @ManyToOne(() => EnveloppeDao, (e) => e.allocations)
  @JoinColumn()
  [ENVELOPPE]!: EnveloppeDao;

  @Column()
  amount!: number;

  @Column()
  createdAt!: Date;

  @Column()
  description?: string;

  @Column()
  payee?: string;
}
