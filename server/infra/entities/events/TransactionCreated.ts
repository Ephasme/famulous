import { Column, Entity } from "typeorm";
import { BaseEvent } from "./BaseEvent";
import * as domain from "../../../domain/transaction/events/TransactionCreated";

@Entity()
export class TransactionCreated extends BaseEvent {
  static from(event: domain.TransactionCreated): TransactionCreated {
    const dao = new TransactionCreated();
    this.mapEventToDao(event, dao);
    dao.accountId = event.payload.accountId;
    dao.amount = event.payload.amount;
    dao.createdAt = event.createdAt;
    dao.description = event.payload.description;
    dao.payee = event.payload.payee;
    return dao;
  }

  @Column()
  accountId!: string;

  @Column()
  amount!: number;

  @Column({ nullable: true })
  payee?: string;

  @Column({ nullable: true })
  description?: string;
}
