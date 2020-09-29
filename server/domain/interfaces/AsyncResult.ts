import { TaskEither } from "fp-ts/lib/TaskEither";
import { ErrorWithStatus } from "./Errors";

export type AsyncResult<T> = TaskEither<ErrorWithStatus, T>;
