import { AggregateEvent, UserType, UserCreatedType, UserCreated } from "../..";

export type UserEvent<EventType extends AnyUserEventType> = AggregateEvent<
  EventType,
  UserType
>;

export type AnyUserEventType = UserCreatedType;
export type AnyUserEvent = UserCreated;
