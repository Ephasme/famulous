import {
  AccountType,
  AccountCreatedType,
  AccountDeletedType,
  AccountCreated,
  AccountDeleted,
  AggregateEvent
} from "../..";

export interface AccountEvent<EventType extends AnyAccountEventType>
  extends AggregateEvent<EventType, AccountType> {}

export type AnyAccountEventType = AccountCreatedType | AccountDeletedType;
export type AnyAccountEvent = AccountCreated | AccountDeleted;
