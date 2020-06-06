import { AnyUserEvent, AnyUserState, USER_CREATED, ActiveUser } from "../..";

export const EMPTY_USER = "empty-user";
export type EmptyUserType = typeof EMPTY_USER;

export class EmptyUser {
  type: EmptyUserType = EMPTY_USER;
  handleEvent(ev: AnyUserEvent): AnyUserState {
    switch (ev.type) {
      case USER_CREATED:
        return new ActiveUser(
          ev.aggregate.id,
          ev.payload.email,
          ev.payload.password,
          ev.payload.salt
        );
    }
  }
}
