import * as uuid from "uuid";
import { UserEvent, With, USER, AggregateInfo, UserType } from "../..";

export const USER_CREATED = "user.created";
export type UserCreatedType = typeof USER_CREATED;

interface Payload {
  email: string;
  password: string;
}

export interface UserCreated
  extends UserEvent<UserCreatedType>,
    With<Payload> {}

class UserCreatedImpl implements UserCreated {
  static make(
    id: string,
    email: string,
    password: string,
  ): UserCreated {
    return new UserCreatedImpl(
      uuid.v4(),
      USER_CREATED,
      { id, type: USER },
      Date.now(),
      { email, password }
    );
  }

  private constructor(
    readonly id: string,
    readonly type: UserCreatedType,
    readonly aggregate: AggregateInfo<UserType>,
    readonly createdAt: number,
    readonly payload: Payload
  ) {}
}

export const userCreated = UserCreatedImpl.make;
