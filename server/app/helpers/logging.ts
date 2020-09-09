import { flow } from "fp-ts/lib/function";
import { mapLeft } from "fp-ts/lib/TaskEither";
import { Logger, AsyncResult } from "../../domain/interfaces";

export const logErrors = <U>(logger: Logger) =>
  flow<ReadonlyArray<AsyncResult<U>>, AsyncResult<U>>(
    mapLeft((err) => {
      logger.error(
        err.error?.message || `no error, status is ${err.statusCode}`
      );
      return err;
    })
  );
