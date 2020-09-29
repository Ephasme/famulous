import { Option } from "fp-ts/lib/Option";
import { AnyEvent, AccountModel, AccountId } from "..";
import { UserModel } from "../user/UserModel";
import { UserId } from "../ValueObjects";
import { AsyncResult } from "./AsyncResult";

export interface Repository {
  persist(...events: AnyEvent[]): AsyncResult<void>;

  findUserById(id: UserId): AsyncResult<Option<UserModel>>;
  findUserByEmail(email: string): AsyncResult<Option<UserModel>>;
  findAllUsers(): AsyncResult<UserModel[]>;

  findAccountById(id: AccountId): AsyncResult<Option<AccountModel>>;
  findAllAccounts(userId: UserId): AsyncResult<AccountModel[]>;
}
