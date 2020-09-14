import {
  AccountType,
  AccountCreatedType,
  AccountDeletedType,
  AccountCreated,
  AccountDeleted,
  AggregateEvent,
} from "../..";
import { AbstractAggregateEvent } from "../../AggregateEvent";

export type AccountEvent<
  EventType extends AnyAccountEventType
> = AggregateEvent<EventType, AccountType>;

export abstract class AbstractAccountEvent<
  E extends AnyAccountEventType
> extends AbstractAggregateEvent<E, AccountType> {}

export type AnyAccountEventType = AccountCreatedType | AccountDeletedType;
export type AnyAccountEvent = AccountCreated | AccountDeleted;
