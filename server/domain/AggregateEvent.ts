import { BaseEvent, EventClass } from "./BaseEvent";

export type AggregateInfo<Type, Id> = { readonly id: Id; readonly type: Type };

export interface AggregateEvent<EventType, AggregateType, Id>
  extends BaseEvent<EventType> {
  readonly id: string;
  readonly eventType: EventType;
  readonly aggregate: AggregateInfo<AggregateType, Id>;
  readonly createdAt: Date;
}

export class AbstractAggregateEvent<EventType, AggregateType, Id>
  implements AggregateEvent<EventType, AggregateType, Id> {
  constructor(
    public readonly id: string,
    public readonly eventType: EventType,
    public readonly aggregate: AggregateInfo<AggregateType, Id>,
    public readonly createdAt: Date
  ) {}
  public readonly eventClass: EventClass = "event";
}
