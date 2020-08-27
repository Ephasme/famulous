import { AnyEntity, AnyUserState } from ".";
import { TaskEither } from "fp-ts/lib/TaskEither";
import { isError } from "util";
import { AnyAccountState } from "./account/states/AccountState";
import { AccountModel } from "./AccountModel";

export type NotFound = {
  error: Error;
  name: "NOT_FOUND";
  statusCode: 404;
};
export function NotFound(error: Error | string = new Error()): ErrorWithStatus {
  return {
    name: "NOT_FOUND",
    statusCode: 404,
    error: isError(error) ? error : new Error(error),
  };
}

export type InternalError = {
  error: Error;
  name: "INTERNAL_ERROR";
  statusCode: 500;
};
export function InternalError(
  error: Error | string = new Error()
): ErrorWithStatus {
  return {
    name: "INTERNAL_ERROR",
    statusCode: 500,
    error: isError(error) ? error : new Error(error),
  };
}
export type Forbidden = { error: Error; name: "FORBIDDEN"; statusCode: 403 };
export function Forbidden(
  error: Error | string = new Error()
): ErrorWithStatus {
  return {
    name: "FORBIDDEN",
    statusCode: 403,
    error: isError(error) ? error : new Error(error),
  };
}
export type Unauthorized = {
  error: Error;
  name: "UNAUTHORIZED";
  statusCode: 401;
};
export function Unauthorized(
  error: Error | string = new Error()
): ErrorWithStatus {
  return {
    name: "UNAUTHORIZED",
    statusCode: 401,
    error: isError(error) ? error : new Error(error),
  };
}
export type UnprocessableEntity = {
  error: Error;
  name: "UNPROCESSABLE_ENTITY";
  statusCode: 422;
};
export function UnprocessableEntity(
  error: Error | string = new Error()
): ErrorWithStatus {
  return {
    name: "UNPROCESSABLE_ENTITY",
    statusCode: 422,
    error: isError(error) ? error : new Error(error),
  };
}
export type BadRequest = {
  error: Error;
  name: "BAD_REQUEST";
  statusCode: 400;
};
export function BadRequest(
  error: Error | string = new Error()
): ErrorWithStatus {
  return {
    name: "BAD_REQUEST",
    statusCode: 400,
    error: isError(error) ? error : new Error(error),
  };
}

export type ErrorWithStatus =
  | NotFound
  | BadRequest
  | InternalError
  | Forbidden
  | UnprocessableEntity
  | Unauthorized;

export type AsyncResult<T> = TaskEither<ErrorWithStatus, T>;

export interface Repository {
  saveAll(...entity: AnyEntity[]): AsyncResult<void>;

  findUserById(id: string): AsyncResult<AnyUserState>;
  findUserByEmail(email: string): AsyncResult<AnyUserState>;
  findAllUsers: AsyncResult<AnyUserState[]>;

  findAccountById(id: string): AsyncResult<AnyAccountState>;
  findAllAccounts(userId: string): AsyncResult<AccountModel[]>;
}
