import { Entity } from "typeorm";
import { BaseEventDao } from "../../BaseEventDao";
import { AccountDeleted } from "../../../../domain";

@Entity({ name: "event_account_deleted" })
export class AccountDeletedDao extends BaseEventDao {
  static from(event: AccountDeleted): AccountDeletedDao {
    const dao = new AccountDeletedDao();
    this.mapEventToDao(event, dao);
    return dao;
  }
}
