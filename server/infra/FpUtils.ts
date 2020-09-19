import { types } from "util";
import * as TE from "fp-ts/lib/TaskEither";
import { AsyncResult, InternalError } from "../domain/interfaces";
import { pipe } from "fp-ts/lib/function";

export const normalizeError: (e: unknown) => Error = (error) =>
  types.isNativeError(error)
    ? error
    : typeof error === "string"
    ? new Error(error)
    : new Error(`badly typed error: ${JSON.stringify(error)}`);

export function tryCatch<L>(task: () => Promise<L>): AsyncResult<L> {
  return pipe(TE.tryCatch(task, normalizeError), TE.mapLeft(InternalError));
}
