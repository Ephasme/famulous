import * as uuid from "uuid";
import { UserEvent, With, AggregateInfo, USER, UserType } from "../..";
import { AbstractUserEvent } from "./UserEvent";

export const USER_CREATED = "user.created";
export type UserCreatedType = typeof USER_CREATED;

interface Payload {
  readonly email: string;
  readonly password: string;
  readonly salt: string;
}

export interface UserCreated
  extends UserEvent<UserCreatedType>,
    With<Payload> {}

class UserCreatedImpl
  extends AbstractUserEvent<UserCreatedType>
  implements UserCreated {
  static make(
    id: string,
    email: string,
    password: string,
    salt: string
  ): UserCreated {
    return new UserCreatedImpl(
      uuid.v4(),
      USER_CREATED,
      { id, type: USER },
      new Date(),
      { email, password, salt }
    );
  }

  private constructor(
    id: string,
    eventType: UserCreatedType,
    aggregate: AggregateInfo<UserType>,
    createdAt: Date,
    public readonly payload: Payload
  ) {
    super(id, eventType, aggregate, createdAt);
  }
}

export const userCreated = UserCreatedImpl.make;
