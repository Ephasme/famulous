import { Router } from "express";

import {
  Repository,
  ACTIVE_USER,
  EMPTY_USER,
  AnyUserState,
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
import { chain, left, right, TaskEither, bimap } from "fp-ts/lib/TaskEither";
import { foldToResponse } from "../foldToResponse";

const isNotEmptyUser = (
  user: AnyUserState
): TaskEither<ErrorWithStatus, AnyUserState> => {
  if (user.type === EMPTY_USER) {
    return left(Unauthorized(`Try to login with an unexisting user`));
  }
  return right(user);
};

const isActiveUser = flow(
  isNotEmptyUser,
  chain((user) => {
    if (user.type !== ACTIVE_USER) {
      return left(Unauthorized(`Try to login with an inactive user`));
    }
    return right(user);
  })
);

const findActiveUserByEmail = (email: string) => (repository: Repository) =>
  pipe(repository.findUserByEmail(email), chain(isActiveUser));

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

const generateToken = (
  user: ActiveUser
): TaskEither<ErrorWithStatus, { token: string }> => {
  const jwtToken = generatingJwt(user);
  return right({ token: jwtToken });
};

const generateTokenWithPassword = (password: string) =>
  flow(chain(checkPassword(password)), chain(generateToken));

export default (repository: Repository, logger: Logger): Router => {
  const router = Router();

  router.post("/login", validator(loginSchema, logger), (req, res) =>
    pipe(
      pipe(repository, findActiveUserByEmail(req.body.email)),
      generateTokenWithPassword(req.body.password),
      bimap(
        (err) => {
          logger.error(
            `error while login ${req.body.email} : ` + err.error?.message ||
              "no message"
          );
          return err;
        },
        (succ) => {
          logger.info(
            `Successful login with following user: ${req.body.email}`
          );
          return succ;
        }
      ),
      foldToResponse(res)
    )()
  );

  return router;
};
