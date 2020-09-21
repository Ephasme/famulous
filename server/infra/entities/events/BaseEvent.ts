import { Column, PrimaryGeneratedColumn } from "typeorm";
import { AnyEvent } from "../../../domain";

export abstract class BaseEvent {
  @PrimaryGeneratedColumn("uuid")
  eventId!: string;

  @Column({ enum: ["event", "command", "query"] })
  eventClass!: string;

  @Column("uuid")
  aggregateId!: string;

  @Column()
  aggregateType!: string;

  @Column()
  eventType!: string;

  @Column()
  createdAt!: Date;

  static mapEventToDao<T extends BaseEvent>(ev: AnyEvent, base: T): T {
    base.aggregateId = ev.aggregate.id.value;
    base.aggregateType = ev.aggregate.type;
    base.eventClass = ev.eventClass;
    base.eventType = ev.eventType;
    base.eventId = ev.id;
    base.createdAt = ev.createdAt;
    return base;
  }
}
