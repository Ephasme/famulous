import { AggregateEvent } from "../common/Event";
import { CREATED, DELETED, Created, Deleted } from "./events";

export * from "./events"

export const ACCOUNT = "account";
export type ACCOUNT = typeof ACCOUNT;

export type ACCOUNT_EVENT = CREATED | DELETED

export type AnyAccountEvent = Created | Deleted

export interface AccountEvent<TName extends ACCOUNT_EVENT, TPayload> extends AggregateEvent<TName, ACCOUNT, TPayload> {}
