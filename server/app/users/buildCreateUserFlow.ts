import { Repository, userCreated, InternalError } from "../../domain";
import { pipe, constant } from "fp-ts/lib/function";
import { findUserOrCreate } from "./findUserOrCreate";
import { map, chain, fromEither } from "fp-ts/lib/TaskEither";
import { withHashedPassword } from "./hashPassword";
import { mapLeft } from "fp-ts/lib/TaskEither";
import { isActiveUser } from "./isActiveUser";
import { logErrors } from "../logErrors";
import Logger from "../interfaces/Logger";

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
        fromEither(user.handleEvent(event)),
        mapLeft(InternalError),
        chain(isActiveUser),
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
