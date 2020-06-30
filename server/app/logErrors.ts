import { flow } from "fp-ts/lib/function";
import { mapLeft } from "fp-ts/lib/TaskEither";
import { AsyncResult } from "../domain";
import Logger from "./interfaces/Logger";

export const logErrors = <U>(logger: Logger) =>
  flow<ReadonlyArray<AsyncResult<U>>, AsyncResult<U>>(
    mapLeft((err) => {
      logger.error(
        err.error?.message || `no error, status is ${err.statusCode}`
      );
      return err;
    })
  );
