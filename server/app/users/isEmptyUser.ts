import { Forbidden, AnyUserState, EMPTY_USER } from "../../domain";
import { left, right } from "fp-ts/lib/TaskEither";

export const isEmptyUser = (user: AnyUserState) =>
  user.type === EMPTY_USER
    ? right(user)
    : left(
        Forbidden(
          `tried to create a user with an existing id ${user.id} ${user.email}`
        )
      );
