import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Timestamps } from "../../domain/Timestamps";
import { TransactionTarget as TransactionSplit } from "./TransactionTarget";

export type CreateTransactionParams = {
  id: string;
  createdAt: Date;
  splits: TransactionSplit[];
};

@Entity()
export class Transaction implements Timestamps {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToMany(() => TransactionSplit, (target) => target.transaction, {
    cascade: true,
  })
  splits!: TransactionSplit[];

  static create(params: CreateTransactionParams): Transaction {
    const dao = new Transaction();
    dao.createdAt = params.createdAt;
    dao.splits = params.splits;
    dao.id = params.id;
    return dao;
  }

  @Column()
  createdAt!: Date;

  @Column({ nullable: true })
  updatedAt?: Date;
}
