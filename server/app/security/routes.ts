import { Router, Response } from "express";

import {
  Repository,
  ACTIVE_USER,
  EMPTY_USER,
  AnyUserState,
  Forbidden,
  ErrorWithStatus,
  Unauthorized,
  ActiveUser,
} from "../../domain";
import validator from "../middlewares/validator";
import Logger from "../interfaces/Logger";
import * as P from "./password";
import { loginSchema } from "./validators";
import { generatingJwt } from "./jwt";
import { pipe, flow } from "fp-ts/lib/function";
import { chain, left, right, TaskEither } from "fp-ts/lib/TaskEither";
import { foldToResponse } from "../foldToResponse";

const isNotEmptyUser = (email: string) => (
  user: AnyUserState
): TaskEither<ErrorWithStatus, AnyUserState> => {
  if (user.type === EMPTY_USER) {
    return left(Unauthorized(`Try to login with an unexisting user ${email}`));
  }
  return right(user);
};

const isActiveUser = (email: string) =>
  flow(
    isNotEmptyUser(email),
    chain((user) => {
      if (user.type !== ACTIVE_USER) {
        return left(
          Unauthorized(`Try to login with an inactive user with ${email}`)
        );
      }
      return right(user);
    })
  );

const checkPassword = (password: string) => (
  user: ActiveUser
): TaskEither<ErrorWithStatus, ActiveUser> => {
  if (!P.checkPassword(password, user.salt, user.password)) {
    return left(
      Unauthorized(
        `Try to login to following user with a bad password: ${user.email}`
      )
    );
  }
  return right(user);
};

const generateToken = (logger: Logger) => (
  user: ActiveUser
): TaskEither<ErrorWithStatus, { token: string }> => {
  const jwtToken = generatingJwt(user);
  logger.info(`Successful login with following user: ${user.email}`);
  return right({ token: jwtToken });
};

export default (repository: Repository, logger: Logger): Router => {
  const router = Router();

  router.post("/login", validator(loginSchema, logger), (req, res) => {
    const { email, password } = req.body;

    return pipe(
      repository.findUserByEmail(email),
      chain(isActiveUser(email)),
      chain(checkPassword(password)),
      chain(generateToken(logger)),
      foldToResponse(res)
    )();
  });

  return router;
};
