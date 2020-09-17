import { AggregateInfo } from ".";

export type EventClass = "event";
export type QueryClass = "query";
export type CommandClass = "command";
export type AnyEventClass = EventClass | QueryClass | CommandClass;

export interface BaseEvent<EventType, AggregateType> {
  readonly id: string;
  readonly event_type: EventType;
  readonly event_class: AnyEventClass;
  readonly aggregate: AggregateInfo<AggregateType>;
  readonly createdAt: Date;
}
