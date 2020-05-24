export type AggregateInfo<Type> = { id: string; type: Type };
export interface AggregateEvent<EventType, AggregateType> {
  id: string;
  type: EventType;
  aggregate: AggregateInfo<AggregateType>;
  createdAt: number;
}
