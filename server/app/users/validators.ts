import * as D from "io-ts/Decoder";
import * as Joi from "@hapi/joi";
import { uuid } from "../helpers/validators";
import { pipe, flow } from "fp-ts/lib/function";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as O from "fp-ts/lib/Option";
import {
  Repository,
  UnprocessableEntity,
  Forbidden,
} from "../../domain/interfaces";

const createUserCommandValidator = D.type({
  id: uuid,
  email: D.string,
  password: D.string,
});

export type CreateUserCommand = D.TypeOf<typeof createUserCommandValidator>;

export const createUserSchema = Joi.object({
  id: Joi.string().required().guid({ version: "uuidv4" }),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const validateCreateUserCommand = (repository: Repository) => (
  cmd: CreateUserCommand
) => {
  return pipe(
    cmd,
    createUserCommandValidator.decode,
    E.mapLeft(flow(D.draw, UnprocessableEntity)),
    TE.fromEither,
    TE.chain((command) =>
      pipe(
        repository.findUserById(command.id),
        TE.chain(
          O.fold(
            () => TE.right(command),
            () => TE.left(Forbidden("already exists"))
          )
        )
      )
    )
  );
};
