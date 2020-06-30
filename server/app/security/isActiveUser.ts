import { ACTIVE_USER } from "../../domain";
import { flow } from "fp-ts/lib/function";
import { isNotEmptyUser } from "./isNotEmptyUser";
import { some, none, chain } from "fp-ts/lib/Option";

export const isActiveUser = flow(
  isNotEmptyUser,
  chain((user) => {
    if (user.type !== ACTIVE_USER) {
      return none;
    }
    return some(user);
  })
);
