import {
  ActiveUser,
  ActiveUserType,
  AnyUserEvent,
  EmptyUser,
  EmptyUserType,
} from "../..";
import { AnyState } from "../../AnyState";
import { ACTIVE_USER } from "./ActiveUser";
import { EMPTY_USER } from "./EmptyUser";

export type AnyUserState = ActiveUser | EmptyUser;
export type AnyUserStateType = ActiveUserType | EmptyUserType;

export function isAnyUserState(state: AnyState): state is AnyUserState {
  switch (state.type) {
    case ACTIVE_USER:
    case EMPTY_USER:
      return true;
  }
  return false;
}

export const USER = "user";
export type UserType = typeof USER;

export interface UserState {
  type: AnyUserStateType;
  handleEvent(ev: AnyUserEvent): AnyUserState;
}