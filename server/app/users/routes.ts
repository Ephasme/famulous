import { Router, Request, Response } from "express";

import {
  Repository,
  userCreated,
  ACTIVE_USER,
  EMPTY_USER,
  USER,
  AnyUserState,
  AnyState,
  InternalError,
  Forbidden,
  ActiveUser,
  AsyncResult,
} from "../../domain";
import validator from "../middlewares/validator";
import { createUserSchema } from "./validators";
import * as S from "../security/password";
import Logger from "../interfaces/Logger";
import { PassportStatic } from "passport";
import { pipe, constant } from "fp-ts/lib/function";
import {
  chain,
  left,
  right,
  map,
  mapLeft,
  fromEither,
} from "fp-ts/lib/TaskEither";
import * as A from "fp-ts/lib/Array";
import { foldToResponse } from "../foldToResponse";
import { some, none, fold } from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import { task } from "fp-ts/lib/Task";

// This must be changed since findBy returns Left(NotFound) instead of EmptyUser
// Probably need to create a createUser that uses findBy to check that it results
// in a NotFound.
const isEmptyUser = (user: AnyState): AsyncResult<AnyUserState> => {
  console.log(user.type);
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

const isActiveUser = (user: AnyUserState): AsyncResult<ActiveUser> => {
  if (user.model !== USER) {
    return left(InternalError(`expecting a user but got a ${user.model}`));
  }
  if (user.type !== ACTIVE_USER) {
    return left(InternalError("user should be active"));
  }
  return right(user);
};

const findOrCreate = (repository: Repository, id: string) =>
  pipe(repository.findUserById(id), chain(isEmptyUser));

const hashPassword = (password: string) => (user: AnyUserState) => ({
  user,
  hashResult: S.hashPassword(password),
});

const buildCreateUserFlow = (repository: Repository, logger: Logger) => (
  id: string,
  email: string,
  password: string
) =>
  pipe(
    findOrCreate(repository, id),
    map(hashPassword(password)),
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

  router.get("/", passport.authenticate("jwt", { session: false }), (_, res) =>
    pipe(
      repository.findAllUsers,
      TE.fold(
        (err) =>
          task.of(
            res
              .status(500)
              .json({ message: err.error?.message || "no message" })
          ),
        (users) =>
          task.of(
            pipe(
              users,
              A.filterMap((u) => (u.type !== EMPTY_USER ? some(u) : none)),
              A.map((u) => ({ id: u.id, email: u.email })),
              (u) => res.json(u)
            )
          )
      )
    )()
  );

  return router;
};
