export type UserStateType = "active" | "inactive";

export type UserModel = {
  id: string;
  state: UserStateType;
  email: string;
  password: string;
  salt: string;
};
