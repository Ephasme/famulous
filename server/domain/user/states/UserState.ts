import {
  ActiveUser,
  ActiveUserType,
  AnyUserEvent,
  EmptyUser,
  EmptyUserType,
} from "../..";
import { AggregateState } from "../../AggregateState";

export type AnyUserState = ActiveUser | EmptyUser;
export type AnyUserStateType = ActiveUserType | EmptyUserType;

export type AnyNonEmptyUserState = Exclude<AnyUserState, EmptyUser>;
export type AnyNonEmptyUserStateType = Exclude<AnyUserStateType, EmptyUserType>;

export type CreateUserCommand = {
  name: "create-user";
  id: string;
  email: string;
  password: string;
};

export type AnyUserCommand = CreateUserCommand;

export const USER = "user";
export type UserType = typeof USER;

export interface UserState<T extends AnyUserStateType>
  extends AggregateState<AnyUserState, AnyUserEvent, T, UserType> {
  type: T;
}
