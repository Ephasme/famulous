import {
  AccountCreatedType,
  AccountDeletedType,
  AccountCreated,
  AccountDeleted,
} from "..";
import { AggregateEvent } from "../../AggregateEvent";
import { AccountType } from "../states";

export * from "./AccountCreated";
export * from "./AccountDeleted";

export interface AccountEvent<EventType extends AnyAccountEventType>
  extends AggregateEvent<EventType, AccountType> {}

export type AnyAccountEventType = AccountCreatedType | AccountDeletedType;
export type AnyAccountEvent = AccountCreated | AccountDeleted;
