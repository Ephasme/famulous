import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Transaction } from "./Transaction";
import { Enveloppe } from "./Enveloppe";
import { ALLOCATIONS_TABLE, ENVELOPPE, TRANSACTION } from "./AllocationSQL";
import { AllocationId, EnveloppeId, TransactionId } from "../../domain";

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
export class Allocation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  static from(params: CreateAllocationParams): Allocation {
    const dao = new Allocation();
    dao.enveloppe = { id: params.enveloppeId.value } as Enveloppe;
    dao.transaction = { id: params.transactionId.value } as Transaction;
    dao.amount = params.amount;
    dao.createdAt = params.createdAt;
    dao.description = params.description;
    dao.id = params.id.value;
    dao.payee = params.payee;
    return dao;
  }

  @ManyToOne(() => Transaction, (t) => t.allocations)
  @JoinColumn()
  [TRANSACTION]!: Transaction;

  @ManyToOne(() => Enveloppe, (e) => e.allocations)
  @JoinColumn()
  [ENVELOPPE]!: Enveloppe;

  @Column()
  amount!: number;

  @Column()
  createdAt!: Date;

  @Column()
  description?: string;

  @Column()
  payee?: string;
}
