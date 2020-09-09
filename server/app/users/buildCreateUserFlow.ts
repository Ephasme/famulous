import { userCreated } from "../../domain";
import { flow } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { hashPassword } from "../security/password";
import { validateCreateUserCommand } from "./validators";
import { logErrors } from "../helpers/logging";
import { Repository, Logger } from "../../domain/interfaces";

export const buildCreateUserFlow = (repository: Repository, logger: Logger) =>
  flow(
    validateCreateUserCommand(repository),
    TE.map((cmd) => ({
      ...cmd,
      ...hashPassword(cmd.password),
    })),
    TE.map(({ id, email, hashedPassword, salt }) =>
      userCreated(id, email, hashedPassword, salt)
    ),
    TE.chain(repository.persist),
    logErrors(logger)
  );
