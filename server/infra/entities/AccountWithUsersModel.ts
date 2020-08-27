import { AccountModel } from "../../domain/AccountModel";

export type AccountWithUsersModel = AccountModel & {
  usersId: string[];
};
