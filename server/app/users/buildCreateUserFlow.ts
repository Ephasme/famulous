import { userCreated, Repository } from "../../domain";
import { pipe, flow } from "fp-ts/lib/function";
import { map, right, chain } from "fp-ts/lib/TaskEither";
import { logErrors } from "../logErrors";
import Logger from "../interfaces/Logger";
import { hashPassword } from "../security/password";

export const buildCreateUserFlow = (repository: Repository, logger: Logger) => (
  id: string,
  email: string,
  password: string
) =>
  pipe(
    password,
    flow(hashPassword, right),
    map(({ hashedPassword, salt }) =>
      userCreated(id, email, hashedPassword, salt)
    ),
    chain(repository.persist),
    logErrors(logger)
  );
