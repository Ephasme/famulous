// This must be changed since findBy returns Left(NotFound) instead of EmptyUser
// Probably need to create a createUser that uses findBy to check that it results

import {
  AnyState,
  AsyncResult,
  AnyUserState,
  USER,
  InternalError,
  EMPTY_USER,
  Forbidden,
} from "../../domain";
import { left, right } from "fp-ts/lib/TaskEither";

// in a NotFound.
export const isEmptyUser = (user: AnyState): AsyncResult<AnyUserState> => {
  console.log(user.type);
  if (user.model !== USER) {
    return left(InternalError(`expecting a user but got a ${user.model}`));
  }
  if (user.type !== EMPTY_USER) {
    return left(
      Forbidden(
        `tried to create a user with an existing id ${user.id} ${user.email}`
      )
    );
  }
  return right(user);
};
