import { EMPTY_USER, AnyUserState, AnyNonEmptyUserState } from "../../domain";
import { some, none, Option } from "fp-ts/lib/Option";

export const isNotEmptyUser = (
  user: AnyUserState
): Option<AnyNonEmptyUserState> =>
  user.type === EMPTY_USER ? none : some(user);
