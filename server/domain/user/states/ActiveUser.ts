import { AnyUserEvent, AnyUserState } from "../..";
import { USER_CREATED } from "../events/UserCreated";

export const ACTIVE_USER = "active-user";
export type ActiveUserType = typeof ACTIVE_USER;

export class ActiveUser {
  type: ActiveUserType = ACTIVE_USER;
  handleEvent(ev: AnyUserEvent): AnyUserState {
    switch (ev.type) {
      case USER_CREATED:
        throw new Error("can't create user, already exists");
    }
  }
  constructor(
    readonly id: string,
    readonly email: string,
    readonly password: string,
    readonly salt: string
  ) {}
}
