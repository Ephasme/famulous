import { fromOption } from "fp-ts/lib/TaskEither";
import {
  ErrorWithStatus,
  Unauthorized,
  InternalError,
} from "../domain/interfaces";

const orError = (fn: (_: string) => ErrorWithStatus) => (message: string) =>
  fromOption(() => fn(message));

export const orUnauthorized = orError(Unauthorized);
export const orInternalError = orError(InternalError);
