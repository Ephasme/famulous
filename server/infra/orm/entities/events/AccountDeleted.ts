import { ChildEntity } from "typeorm";
import { BaseEvent } from "./BaseEvent";
import * as domain from "../../../../domain/account/events/AccountDeleted";

@ChildEntity()
export class AccountDeleted extends BaseEvent {
  static from(event: domain.AccountDeleted): AccountDeleted {
    const dao = new AccountDeleted();
    this.mapEventToDao(event, dao);
    return dao;
  }
}
