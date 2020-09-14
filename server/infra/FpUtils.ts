import { types } from "util";
import * as TE from "fp-ts/lib/TaskEither";

export const normalizeError: (e: unknown) => Error = (error) =>
  types.isNativeError(error)
    ? error
    : typeof error === "string"
    ? new Error(error)
    : new Error(`badly typed error: ${JSON.stringify(error)}`);

export function tryCatch<L>(task: () => Promise<L>) {
  return TE.tryCatch(task, normalizeError);
}
