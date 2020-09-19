import { BaseEvent, EventClass } from "./BaseEvent";

export type AggregateInfo<Type> = { readonly id: string; readonly type: Type };

export type AggregateEvent<EventType, AggregateType> = BaseEvent<
  EventType,
  AggregateType
>;

export class AbstractAggregateEvent<EventType, AggregateType>
  implements AggregateEvent<EventType, AggregateType> {
  constructor(
    public readonly id: string,
    public readonly eventType: EventType,
    public readonly aggregate: AggregateInfo<AggregateType>,
    public readonly createdAt: Date
  ) {}
  public readonly eventClass: EventClass = "event";
}
