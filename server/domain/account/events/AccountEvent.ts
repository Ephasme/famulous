import {
  AccountType,
  AccountCreatedType,
  AccountDeletedType,
  AccountCreated,
  AccountDeleted,
  AggregateEvent,
} from "../..";

export type AccountEvent<
  EventType extends AnyAccountEventType
> = AggregateEvent<EventType, AccountType>;

export type AnyAccountEventType = AccountCreatedType | AccountDeletedType;
export type AnyAccountEvent = AccountCreated | AccountDeleted;
