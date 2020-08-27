import { ACTIVE_USER } from "..";
import { flow } from "fp-ts/lib/function";
import { some, none, filterMap } from "fp-ts/lib/Option";
import { isNotEmptyUser } from "./isNotEmptyUser";

export const isActiveUser = flow(
  isNotEmptyUser,
  filterMap((u) => (u.type !== ACTIVE_USER ? none : some(u)))
);
