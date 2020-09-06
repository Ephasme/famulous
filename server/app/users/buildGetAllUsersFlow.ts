import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as A from "fp-ts/lib/Array";
import Logger from "../../infra/interfaces/Logger";
import { logErrors } from "../helpers/logging";
import { Repository } from "../../infra/interfaces/Repository";

export const buildGetAllUsersFlow = (
  repository: Repository,
  logger: Logger
) => () =>
  pipe(
    repository.findAllUsers(),
    TE.map((users) =>
      pipe(
        users,
        A.map((u) => ({ id: u.id, email: u.email }))
      )
    ),
    logErrors(logger)
  );
