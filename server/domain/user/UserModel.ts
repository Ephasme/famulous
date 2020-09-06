export const USER = "user";
export type UserType = typeof USER;

export type UserModel = {
  id: string;
  state: "active" | "inactive";
  email: string;
  password: string;
  salt: string;
};

export type UserView = {
  id: string;
  email: string;
};
