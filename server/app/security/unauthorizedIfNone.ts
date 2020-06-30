import { Unauthorized } from "../../domain";
import { left, right } from "fp-ts/lib/TaskEither";
import { fold, Option } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";

export const unauthorizedIfNone = (message: string) => <T>(opt: Option<T>) => {
  return pipe(
    opt,
    fold(
      () => left(Unauthorized(message)),
      (x) => right(x)
    )
  );
};
