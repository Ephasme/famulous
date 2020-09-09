import { TaskEither } from "fp-ts/lib/TaskEither";
import { Option } from "fp-ts/lib/Option";
import { AnyEvent, AccountModel } from "..";
import { UserModel } from "../user/UserModel";
import { ErrorWithStatus } from "./Errors";

export type AsyncResult<T> = TaskEither<ErrorWithStatus, T>;

export interface Repository {
  persist(...events: AnyEvent[]): AsyncResult<void>;

  findUserById(id: string): AsyncResult<Option<UserModel>>;
  findUserByEmail(email: string): AsyncResult<Option<UserModel>>;
  findAllUsers(): AsyncResult<UserModel[]>;

  findAccountById(id: string): AsyncResult<Option<AccountModel>>;
  findAllAccounts(userId: string): AsyncResult<AccountModel[]>;
}
