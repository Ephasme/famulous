import { AggregateEvent, UserType, UserCreatedType, UserCreated } from "../..";
import { AbstractAggregateEvent } from "../../AggregateEvent";
import { UserDeleted, UserDeletedType } from "./UserDeleted";

export type UserEvent<EventType extends AnyUserEventType> = AggregateEvent<
  EventType,
  UserType
>;

export abstract class AbstractUserEvent<
  T extends AnyUserEventType
> extends AbstractAggregateEvent<T, UserType> {}

export type AnyUserEventType = UserCreatedType | UserDeletedType;
export type AnyUserEvent = UserCreated | UserDeleted;
