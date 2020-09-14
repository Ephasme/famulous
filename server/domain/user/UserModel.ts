export const USER = "user";
export type UserType = typeof USER;

export type UserStates = "created" | "active" | "deleted" | "inactive";

export type UserModel = {
  id: string;
  state: UserStates;
  email: string;
  password: string;
  salt: string;
};

export type UserView = {
  id: string;
  email: string;
};
