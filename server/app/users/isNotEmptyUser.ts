import { EMPTY_USER, AnyUserState } from "../../domain";
import { some, none, Option } from "fp-ts/lib/Option";

export const isNotEmptyUser = (user: AnyUserState): Option<AnyUserState> => {
  if (user.type === EMPTY_USER) {
    return none;
  }
  return some(user);
};
