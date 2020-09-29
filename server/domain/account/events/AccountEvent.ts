import {
  AccountType,
  AccountCreatedType,
  AccountDeletedType,
  AccountCreated,
  AccountDeleted,
  AggregateEvent,
} from "../..";
import { AbstractAggregateEvent } from "../../AggregateEvent";
import { AccountId } from "../../ValueObjects";

export type AccountEvent<
  EventType extends AnyAccountEventType
> = AggregateEvent<EventType, AccountType, AccountId>;

export abstract class AbstractAccountEvent<
  E extends AnyAccountEventType
> extends AbstractAggregateEvent<E, AccountType, AccountId> {}

export type AnyAccountEventType = AccountCreatedType | AccountDeletedType;
export type AnyAccountEvent = AccountCreated | AccountDeleted;
