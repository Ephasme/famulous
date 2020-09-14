// import {
//   BaseEntity,
//   Column,
//   Entity,
//   JoinTable,
//   OneToMany,
//   OneToOne,
//   PrimaryGeneratedColumn,
// } from "typeorm";
// import { Account } from "./Account";
// import { Transaction } from "./Transaction";

// @Entity()
// export class TransactionTarget extends BaseEntity {
//   @PrimaryGeneratedColumn("uuid")
//   id!: string;

//   @Column()
//   @OneToMany(() => Transaction, (transaction) => transaction.targets)
//   @JoinTable()
//   transaction!: Transaction;

//   @Column()
//   @OneToOne(() => Account)
//   account!: Account;

//   @Column()
//   payee!: string;

//   @Column()
//   created_at!: Date;

//   @Column()
//   amount!: number;
// }
