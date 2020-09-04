import {
  TransactionCreatedType,
  TransactionCreated,
  AggregateEvent,
} from "../..";

export const TRANSACTION = "transaction";
export type TransactionType = typeof TRANSACTION;

export type TransactionEvent<
  EventType extends AnyTransactionEventType
> = AggregateEvent<EventType, TransactionType>;

export type AnyTransactionEventType = TransactionCreatedType;
export type AnyTransactionEvent = TransactionCreated;
