import * as uuid from "uuid";
import { UserEvent, With, AggregateInfo, USER, UserType } from "../..";
import { AbstractUserEvent } from "./UserEvent";

export const USER_DELETED = "user.deleted";
export type UserDeletedType = typeof USER_DELETED;

export interface UserDeleted extends UserEvent<UserDeletedType>, With<void> {}

class UserDeletedImpl
  extends AbstractUserEvent<UserDeletedType>
  implements UserDeleted {
  static make(id: string): UserDeleted {
    return new UserDeletedImpl(
      uuid.v4(),
      USER_DELETED,
      { id, type: USER },
      new Date()
    );
  }

  private constructor(
    id: string,
    eventType: UserDeletedType,
    aggregate: AggregateInfo<UserType>,
    createdAt: Date,
    public readonly payload: void
  ) {
    super(id, eventType, aggregate, createdAt);
  }
}

export const userDeleted = UserDeletedImpl.make;
