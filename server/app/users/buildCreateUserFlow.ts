import {
  Repository,
  userCreated,
  InternalError,
  isActiveUser,
} from "../../domain";
import { pipe, constant, flow } from "fp-ts/lib/function";
import { findUserOrCreate } from "./findUserOrCreate";
import { mapLeft, map, chain, fromEither } from "fp-ts/lib/TaskEither";
import { withHashedPassword } from "./hashPassword";
import { logErrors } from "../logErrors";
import Logger from "../interfaces/Logger";
import { orInternalError as orInternalErrorWith } from "../errorsIfNone";

export const buildCreateUserFlow = (repository: Repository, logger: Logger) => (
  id: string,
  email: string,
  password: string
) =>
  pipe(
    findUserOrCreate(repository, id),
    map(withHashedPassword(password)),
    chain(({ user, hashResult: { hashedPassword, salt } }) => {
      const event = userCreated(id, email, hashedPassword, salt);
      return pipe(
        pipe(user.handleEvent(event), fromEither, mapLeft(InternalError)),
        chain(
          flow(
            isActiveUser,
            orInternalErrorWith(
              `can't create user ${email} with id ${id}, event did not result on an active user`
            )
          )
        ),
        chain((user) =>
          pipe(
            repository.saveAll(user, event),
            map(constant({ id: user.id, email: user.email }))
          )
        )
      );
    }),
    logErrors(logger)
  );
