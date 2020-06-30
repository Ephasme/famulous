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
import { some, none } from "fp-ts/lib/Option";
import { logErrors } from "../logErrors";

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

const buildGetAllUsersFlow = (repository: Repository, logger: Logger) =>
  pipe(
    repository.findAllUsers,
    map((users) =>
      pipe(
        users,
        A.filterMap((u) => (u.type !== EMPTY_USER ? some(u) : none)),
        A.map((u) => ({ id: u.id, email: u.email }))
      )
    ),
    logErrors(logger)
  );

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
    logErrors(logger)
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

  const getAllUsersFlow = buildGetAllUsersFlow(repository, logger);
  const getAllUsersTask = (_: Request, res: Response) =>
    pipe(getAllUsersFlow, foldToResponse(res))();
  router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    getAllUsersTask
  );

  return router;
};
