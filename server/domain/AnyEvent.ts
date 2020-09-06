import {
  AnyAccountEvent,
  AnyAccountEventType,
  AnyUserEvent,
  AnyUserEventType,
  AnyTransactionEvent,
  AnyTransactionEventType,
} from ".";

export type AnyEvent = AnyAccountEvent | AnyUserEvent | AnyTransactionEvent;
export type AnyEventType =
  | AnyAccountEventType
  | AnyUserEventType
  | AnyTransactionEventType;
