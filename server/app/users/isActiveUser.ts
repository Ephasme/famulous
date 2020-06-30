import { ACTIVE_USER } from "../../domain";
import { flow } from "fp-ts/lib/function";
import { isNotEmptyUser } from "./isNotEmptyUser";
import { some, none, filterMap } from "fp-ts/lib/Option";

export const isActiveUser = flow(
  isNotEmptyUser,
  filterMap((u) => (u.type !== ACTIVE_USER ? none : some(u)))
);
