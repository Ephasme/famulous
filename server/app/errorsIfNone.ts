import { Unauthorized, InternalError, ErrorWithStatus } from "../domain";
import { fromOption } from "fp-ts/lib/TaskEither";

const orError = (fn: (_: string) => ErrorWithStatus) => (message: string) =>
  fromOption(() => fn(message));

export const orUnauthorized = orError(Unauthorized);
export const orInternalError = orError(InternalError);
