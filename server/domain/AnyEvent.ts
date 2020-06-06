import {
  AnyAccountEvent,
  AnyAccountEventType,
  AnyUserEvent,
  AnyUserEventType,
} from ".";

export type AnyEvent = AnyAccountEvent | AnyUserEvent;
export type AnyEventType = AnyAccountEventType | AnyUserEventType;
