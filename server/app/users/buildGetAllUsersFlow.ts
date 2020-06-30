import { Repository, EMPTY_USER } from "../../domain";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { some, none } from "fp-ts/lib/Option";
import { logErrors } from "../logErrors";
import * as A from "fp-ts/lib/Array";
import Logger from "../interfaces/Logger";

export const buildGetAllUsersFlow = (repository: Repository, logger: Logger) =>
  pipe(
    repository.findAllUsers,
    TE.map((users) =>
      pipe(
        users,
        A.filterMap((u) => (u.type !== EMPTY_USER ? some(u) : none)),
        A.map((u) => ({ id: u.id, email: u.email }))
      )
    ),
    logErrors(logger)
  );
