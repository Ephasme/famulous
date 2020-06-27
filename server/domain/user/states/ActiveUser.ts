import { AnyUserEvent, AnyUserState, UserState } from "../..";
import { USER_CREATED } from "../events/UserCreated";
import { Either, left } from "fp-ts/lib/Either";

export const ACTIVE_USER = "active-user";
export type ActiveUserType = typeof ACTIVE_USER;

export class ActiveUser implements UserState<ActiveUserType> {
  model: "user" = "user";
  type: ActiveUserType = ACTIVE_USER;
  handleEvent(ev: AnyUserEvent): Either<Error, AnyUserState> {
    switch (ev.type) {
      case USER_CREATED:
        return left(new Error("can't create user, already exists"));
    }
  }
  constructor(
    readonly id: string,
    readonly email: string,
    readonly password: string,
    readonly salt: string
  ) {}
}
