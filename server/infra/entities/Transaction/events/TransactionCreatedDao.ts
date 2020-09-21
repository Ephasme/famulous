import { Column, Entity } from "typeorm";
import { TransactionCreated } from "../../../../domain";
import { BaseEventDao } from "../../BaseEventDao";

@Entity({ name: "event_transaction_created" })
export class TransactionCreatedDao extends BaseEventDao {
  static from(event: TransactionCreated): TransactionCreatedDao {
    const dao = new TransactionCreatedDao();
    this.mapEventToDao(event, dao);
    dao.accountId = event.payload.accountId.value;
    dao.amount = event.payload.amount;
    dao.createdAt = event.createdAt;
    dao.label = event.payload.label;
    return dao;
  }

  @Column()
  accountId!: string;

  @Column()
  amount!: number;

  @Column({ nullable: true })
  label?: string;
}
