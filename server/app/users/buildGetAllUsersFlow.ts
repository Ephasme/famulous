import { Repository } from "../../domain";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { logErrors } from "../logErrors";
import * as A from "fp-ts/lib/Array";
import Logger from "../interfaces/Logger";

export const buildGetAllUsersFlow = (repository: Repository, logger: Logger) =>
  pipe(
    repository.findAllUsers,
    TE.map((users) =>
      pipe(
        users,
        A.map((u) => ({ id: u.id, email: u.email }))
      )
    ),
    logErrors(logger)
  );
