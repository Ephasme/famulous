import { ChildEntity, Column } from "typeorm";
import { BaseEvent } from "./BaseEvent";
import * as domain from "../../../../domain/transaction/events/TransactionCreated";

@ChildEntity()
export class TransactionCreated extends BaseEvent {
  @Column()
  account_id!: string;

  @Column("json")
  targets!: string;

  static from(event: domain.TransactionCreated): TransactionCreated {
    return {
      ...this.mapEventToDao(event, new TransactionCreated()),
      account_id: event.payload.account_id,
      targets: JSON.stringify(event.payload.targets),
    };
  }
}
