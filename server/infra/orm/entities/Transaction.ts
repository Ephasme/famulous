// import {
//   BaseEntity,
//   Column,
//   Entity,
//   ManyToOne,
//   OneToMany,
//   PrimaryGeneratedColumn,
// } from "typeorm";
// import { TransactionTarget } from "./TransactionTarget";
// import { Account } from "./Account";

// @Entity()
// export class Transaction {
//   @PrimaryGeneratedColumn("uuid")
//   id!: string;

//   @ManyToOne(() => TransactionTarget, (target) => target.transaction, {
//     cascade: true,
//   })
//   @Column()
//   targets!: TransactionTarget[];

//   @ManyToOne(() => Account, (account) => account.transactions)
//   account!: Account;
// }
