import { Option } from "fp-ts/lib/Option";
import { AnyEvent, AccountModel } from "..";
import { UserModel } from "../user/UserModel";
import { AsyncResult } from "./AsyncResult";

export interface Repository {
  persist(...events: AnyEvent[]): AsyncResult<void>;

  findUserById(id: string): AsyncResult<Option<UserModel>>;
  findUserByEmail(email: string): AsyncResult<Option<UserModel>>;
  findAllUsers(): AsyncResult<UserModel[]>;

  findAccountById(id: string): AsyncResult<Option<AccountModel>>;
  findAllAccounts(userId: string): AsyncResult<AccountModel[]>;
}
