import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEvent } from "./BaseEvent";
import * as domain from "../../../domain/account/events/AccountCreated";
import { User } from "../User";

@Entity()
export class AccountCreated extends BaseEvent {
  @ManyToOne(() => User)
  userId!: string;

  @Column()
  currency!: string;

  @Column()
  name!: string;

  static from(event: domain.AccountCreated): AccountCreated {
    const dao = new AccountCreated();
    this.mapEventToDao(event, dao);
    dao.currency = event.payload.currency;
    dao.name = event.payload.name;
    dao.userId = event.payload.userId;
    return dao;
  }
}
