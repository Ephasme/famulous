import { Column, Entity, ManyToOne } from "typeorm";
import { AccountCreated } from "../../../../domain";
import { BaseEventDao } from "../../BaseEventDao";
import { UserDao } from "../../User";

@Entity({ name: "event_account_created" })
export class AccountCreatedDao extends BaseEventDao {
  @ManyToOne(() => UserDao)
  userId!: string;

  @Column()
  currency!: string;

  @Column()
  name!: string;

  static from(event: AccountCreated): AccountCreatedDao {
    const dao = new AccountCreatedDao();
    this.mapEventToDao(event, dao);
    dao.currency = event.payload.currency;
    dao.name = event.payload.name;
    dao.userId = event.payload.userId.value;
    return dao;
  }
}
