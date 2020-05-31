import {
  ActiveUser,
  ActiveUserType,
  AnyUserEvent,
  EmptyUser,
  EmptyUserType,
} from "../..";

export type AnyUserState = ActiveUser | EmptyUser;
export type AnyUserStateType = ActiveUserType | EmptyUserType;

export const USER = "user";
export type UserType = typeof USER;

export interface UserState {
  type: AnyUserStateType;
  handleEvent(ev: AnyUserEvent): AnyUserState;
}
