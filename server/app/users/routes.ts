import { Router, Request, Response } from "express";

import {
  Repository,
  userCreated,
  ACTIVE_USER,
  EMPTY_USER,
  USER,
  AnyUserState,
  AnyState,
  ErrorWithStatus,
  InternalError,
  Forbidden,
  ActiveUser,
} from "../../domain";
import validator from "../middlewares/validator";
import { createUserSchema } from "./validators";
import { hashPassword } from "../security/password";
import Logger from "../interfaces/Logger";
import { PassportStatic } from "passport";
import { pipe, constant } from "fp-ts/lib/function";
import {
  chain,
  left,
  right,
  TaskEither,
  map,
  mapLeft,
  fold,
  fromEither,
} from "fp-ts/lib/TaskEither";
import { task } from "fp-ts/lib/Task";
import { foldToResponse } from "../foldToResponse";

// This must be changed since findBy returns Left(NotFound) instead of EmptyUser
// Probably need to create a createUser that uses findBy to check that it results
// in a NotFound.
const isValidUser = (
  user: AnyState
): TaskEither<ErrorWithStatus, AnyUserState> => {
  if (user.model !== USER) {
    return left(InternalError(`expecting a user but got a ${user.model}`));
  }
  if (user.type !== EMPTY_USER) {
    return left(
      Forbidden(
        `tried to create a user with an existing id ${user.id} ${user.email}`
      )
    );
  }
  return right(user);
};

const findValidUserById = (repository: Repository, id: string) =>
  pipe(repository.findUserById(id), chain(isValidUser));

const userWithPassword = (password: string) => (user: AnyUserState) => ({
  user,
  password: hashPassword(password),
});

const buildCreateUserFlow = (repository: Repository, logger: Logger) => (
  id: string,
  email: string,
  password: string
) =>
  pipe(
    findValidUserById(repository, id),
    map(userWithPassword(password)),
    chain(({ user, password }) => {
      const event = userCreated(
        id,
        email,
        password.hashedPassword,
        password.salt
      );
      return pipe(
        fromEither(pipe(user.handleEvent(event))),
        mapLeft(InternalError),
        chain((newState) => {
          if (newState.type !== ACTIVE_USER) {
            return left(
              InternalError(
                `creation event for user resulted in state ${newState.type}, expected ${ACTIVE_USER}`
              )
            );
          }
          return pipe(
            repository.saveAll(newState, event),
            map(constant(newState))
          );
        })
      );
    }),
    mapLeft((err) => {
      logger.error(
        err.error?.message || `no error, status is ${err.statusCode}`
      );
      return err;
    })
  );

export default (
  repository: Repository,
  logger: Logger,
  passport: PassportStatic
): Router => {
  const router = Router();
  const createUserFlow = buildCreateUserFlow(repository, logger);
  const createUserTask = (req: Request, res: Response) =>
    pipe(
      createUserFlow(req.body.id, req.body.email, req.body.password),
      foldToResponse(res)
    )();

  router.post("/", validator(createUserSchema, logger), createUserTask);

  router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      const users = await repository.findAllUsers();

      res.json(users);
    }
  );

  return router;
};
