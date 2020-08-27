import {
  AnyUserEvent,
  AnyUserState,
  USER_CREATED,
  ActiveUser,
  UserState,
} from "../..";
import { Either, right } from "fp-ts/lib/Either";

export const EMPTY_USER = "empty-user";
export type EmptyUserType = typeof EMPTY_USER;

export class EmptyUser implements UserState<EmptyUserType> {
  model: "user" = "user";
  type: EmptyUserType = EMPTY_USER;
  handleEvent(ev: AnyUserEvent): Either<Error, AnyUserState> {
    switch (ev.type) {
      case USER_CREATED:
        return right(
          new ActiveUser(
            ev.aggregate.id,
            ev.payload.email,
            ev.payload.password,
            ev.payload.salt
          )
        );
    }
  }
}
