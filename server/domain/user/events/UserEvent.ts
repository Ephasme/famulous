import { AggregateEvent, UserType, UserCreatedType, UserCreated } from "../..";
import { AbstractAggregateEvent } from "../../AggregateEvent";
import { UserId } from "../../ValueObjects";
import { UserDeleted, UserDeletedType } from "./UserDeleted";

export type UserEvent<EventType extends AnyUserEventType> = AggregateEvent<
  EventType,
  UserType,
  UserId
>;

export abstract class AbstractUserEvent<
  T extends AnyUserEventType
> extends AbstractAggregateEvent<T, UserType, UserId> {}

export type AnyUserEventType = UserCreatedType | UserDeletedType;
export type AnyUserEvent = UserCreated | UserDeleted;
