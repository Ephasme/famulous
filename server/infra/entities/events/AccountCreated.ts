import { Column, Entity, ManyToOne } from "typeorm";
import { Account } from "../Account";
import { BaseEvent } from "./BaseEvent";
import * as domain from "../../../domain/account/events/AccountCreated";

@Entity()
export class AccountCreated extends BaseEvent {
  @ManyToOne(() => Account)
  user_id!: string;

  @Column()
  currency!: string;

  @Column()
  name!: string;

  static from(event: domain.AccountCreated): AccountCreated {
    const dao = new AccountCreated();
    this.mapEventToDao(event, dao);
    dao.currency = event.payload.currency;
    dao.name = event.payload.name;
    dao.user_id = event.payload.userId;
    return dao;
  }
}
