import { BaseEvent, EventClass } from "./BaseEvent";

export type AggregateInfo<Type> = { readonly id: string; readonly type: Type };

export interface AggregateEvent<EventType, AggregateType>
  extends BaseEvent<EventType, AggregateType> {}

export class AbstractAggregateEvent<EventType, AggregateType>
  implements AggregateEvent<EventType, AggregateType> {
  constructor(
    public readonly id: string,
    public readonly event_type: EventType,
    public readonly aggregate: AggregateInfo<AggregateType>,
    public readonly createdAt: Date
  ) {}
  public readonly event_class: EventClass = "event";
}
