import {
  AnyUserState,
  AsyncResult,
  ActiveUser,
  USER,
  InternalError,
  ACTIVE_USER,
} from "../../domain";
import { left, right } from "fp-ts/lib/TaskEither";

export const isActiveUser = (user: AnyUserState): AsyncResult<ActiveUser> => {
  if (user.model !== USER) {
    return left(InternalError(`expecting a user but got a ${user.model}`));
  }
  if (user.type !== ACTIVE_USER) {
    return left(InternalError("user should be active"));
  }
  return right(user);
};
