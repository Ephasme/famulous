import {
  TransactionCreatedType,
  TransactionCreated,
  AggregateEvent,
  AbstractAggregateEvent,
  TransactionType,
} from "../..";

export type TransactionEvent<
  EventType extends AnyTransactionEventType
> = AggregateEvent<EventType, TransactionType>;

export abstract class AbstractTransactionEvent<
  E extends AnyTransactionEventType
> extends AbstractAggregateEvent<E, TransactionType> {}

export type AnyTransactionEventType = TransactionCreatedType;
export type AnyTransactionEvent = TransactionCreated;
