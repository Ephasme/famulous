import { Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./Account";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  //   @ManyToOne(() => TransactionTarget, (target) => target.transaction, {
  //     cascade: true,
  //   })
  //   @Column()
  //   targets!: TransactionTarget[];

  @ManyToOne(() => Account, (account) => account.transactions)
  @JoinTable()
  account!: Account;
}
