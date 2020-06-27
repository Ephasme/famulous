import { AnyEntity, AnyUserState } from ".";
import { TaskEither } from "fp-ts/lib/TaskEither";
import { isError } from "util";

export type NotFound = {
  error?: Error;
  name: "NOT_FOUND";
  statusCode: 404;
};
export function NotFound(error?: Error | string): ErrorWithStatus {
  return {
    name: "NOT_FOUND",
    statusCode: 404,
    error: isError(error) ? error : new Error(error),
  };
}

export type InternalError = {
  error?: Error;
  name: "INTERNAL_ERROR";
  statusCode: 500;
};
export function InternalError(error?: Error | string): ErrorWithStatus {
  return {
    name: "INTERNAL_ERROR",
    statusCode: 500,
    error: isError(error) ? error : new Error(error),
  };
}
export type Forbidden = { error?: Error; name: "FORBIDDEN"; statusCode: 301 };
export function Forbidden(error?: Error | string): ErrorWithStatus {
  return {
    name: "FORBIDDEN",
    statusCode: 301,
    error: isError(error) ? error : new Error(error),
  };
}
export type Unauthorized = {
  error?: Error;
  name: "UNAUTHORIZED";
  statusCode: 401;
};
export function Unauthorized(error?: Error | string): ErrorWithStatus {
  return {
    name: "UNAUTHORIZED",
    statusCode: 401,
    error: isError(error) ? error : new Error(error),
  };
}
export type BadRequest = {
  error?: Error;
  name: "BAD_REQUEST";
  statusCode: 400;
};
export function BadRequest(error?: Error | string): ErrorWithStatus {
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
  | Unauthorized;

export type AsyncResult<T> = TaskEither<ErrorWithStatus, T>;

export interface Repository {
  saveAll(...entity: AnyEntity[]): AsyncResult<void>;
  findUserById(id: string): AsyncResult<AnyUserState>;
  findUserByEmail(email: string): AsyncResult<AnyUserState>;
  findAllUsers: AsyncResult<AnyUserState[]>;
}
