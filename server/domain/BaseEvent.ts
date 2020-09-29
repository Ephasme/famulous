export type EventClass = "event";
export type QueryClass = "query";
export type CommandClass = "command";
export type AnyEventClass = EventClass | QueryClass | CommandClass;

export interface BaseEvent<EventType> {
  readonly id: string;
  readonly eventType: EventType;
  readonly eventClass: AnyEventClass;
  readonly createdAt: Date;
}
