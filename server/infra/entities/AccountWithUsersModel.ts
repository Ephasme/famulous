import { AccountModel } from "../../domain";

export type AccountWithUsersModel = AccountModel & {
  usersId: string[];
};
