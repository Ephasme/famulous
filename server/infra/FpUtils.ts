import { isError, isString } from "util";
import { tryCatch } from "fp-ts/lib/TaskEither";

export const normalizeError: (e: unknown) => Error = (e) =>
  isError(e) ? e : isString(e) ? new Error(e) : new Error("badly typed error");

export function tryCatchNormalize<L>(task: () => Promise<L>) {
  return tryCatch(task, normalizeError);
}
