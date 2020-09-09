import { fromOption } from "fp-ts/lib/TaskEither";
import {
  ErrorWithStatus,
  Unauthorized,
  InternalError,
} from "../infra/interfaces/Repository";

const orError = (fn: (_: string) => ErrorWithStatus) => (message: string) =>
  fromOption(() => fn(message));

export const orUnauthorized = orError(Unauthorized);
export const orInternalError = orError(InternalError);
