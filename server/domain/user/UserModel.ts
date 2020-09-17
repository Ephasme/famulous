import { Timestamps } from "../Timestamps";

export const USER = "user";
export type UserType = typeof USER;

export const USER_STATES = [
  "created",
  "active",
  "deleted",
  "inactive",
] as const;
export type UserStates = typeof USER_STATES[number];

export type UserModel = {
  id: string;
  state: UserStates;
  email: string;
  password: string;
  salt: string;
} & Timestamps;

export type UserView = {
  id: string;
  email: string;
};
