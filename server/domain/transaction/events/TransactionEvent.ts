import {
  TransactionCreatedType,
  TransactionCreated,
  AggregateEvent,
  AbstractAggregateEvent,
  TransactionType,
} from "../..";
import { TransactionId } from "../../ValueObjects";

export type TransactionEvent<
  EventType extends AnyTransactionEventType
> = AggregateEvent<EventType, TransactionType, TransactionId>;

export abstract class AbstractTransactionEvent<
  E extends AnyTransactionEventType
> extends AbstractAggregateEvent<E, TransactionType, TransactionId> {}

export type AnyTransactionEventType = TransactionCreatedType;
export type AnyTransactionEvent = TransactionCreated;
