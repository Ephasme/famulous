import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
} from "typeorm";
import { AnyEvent } from "../../../domain";

export abstract class BaseEvent {
  @PrimaryGeneratedColumn("uuid")
  event_id!: string;

  @Column({ enum: ["event", "command", "query"] })
  event_class!: string;

  @Column("uuid")
  aggregate_id!: string;

  @Column()
  aggregate_type!: string;

  @Column()
  event_type!: string;

  @Column()
  created_at!: Date;

  static mapEventToDao<T extends BaseEvent>(ev: AnyEvent, base: T): T {
    base.aggregate_id = ev.aggregate.id;
    base.aggregate_type = ev.aggregate.type;
    base.event_class = ev.event_class;
    base.event_type = ev.event_type;
    base.event_id = ev.id;
    base.created_at = ev.createdAt;
    return base;
  }
}
