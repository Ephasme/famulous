import {
  TransactionCreatedType,
  TransactionCreated,
  AggregateEvent,
  AbstractAggregateEvent,
} from "../..";

export const TRANSACTION = "transaction";
export type TransactionType = typeof TRANSACTION;

export type TransactionEvent<
  EventType extends AnyTransactionEventType
> = AggregateEvent<EventType, TransactionType>;

export abstract class AbstractTransactionEvent<
  E extends AnyTransactionEventType
> extends AbstractAggregateEvent<E, TransactionType> {}

export type AnyTransactionEventType = TransactionCreatedType;
export type AnyTransactionEvent = TransactionCreated;
