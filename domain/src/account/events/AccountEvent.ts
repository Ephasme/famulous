import { AggregateEvent } from "../../AggregateEvent";
import { AccountCreatedType, AccountCreated } from "./AccountCreated";
import { AccountDeletedType, AccountDeleted } from "./AccountDeleted";
import { AccountType } from "../states/AccountState";

export interface AccountEvent<EventType extends AnyAccountEventType>
  extends AggregateEvent<EventType, AccountType> {}

export type AnyAccountEventType = AccountCreatedType | AccountDeletedType;
export type AnyAccountEvent = AccountCreated | AccountDeleted;
