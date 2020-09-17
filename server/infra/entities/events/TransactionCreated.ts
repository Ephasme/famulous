import { ChildEntity, Column, Entity } from "typeorm";
import { BaseEvent } from "./BaseEvent";
import * as domain from "../../../domain/transaction/events/TransactionCreated";

@Entity()
export class TransactionCreated extends BaseEvent {
  @Column()
  account_id!: string;

  @Column("json")
  targets!: object;

  static from(event: domain.TransactionCreated): TransactionCreated {
    const dao = new TransactionCreated();
    this.mapEventToDao(event, dao);
    dao.account_id = event.payload.account_id;
    dao.targets = event.payload.targets;
    return dao;
  }
}
