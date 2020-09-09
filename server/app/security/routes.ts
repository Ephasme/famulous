import { Router } from "express";

import validator from "../middlewares/validator";
import Logger from "../../infra/interfaces/Logger";
import * as P from "./password";
import { loginSchema } from "./validators";
import { generatingJwt } from "./jwt";
import { pipe, flow } from "fp-ts/lib/function";
import { chain, left, right, TaskEither, bimap } from "fp-ts/lib/TaskEither";
import { orUnauthorized as orUnauthorizedWith } from "../errorsIfNone";
import { foldToOk } from "../responseFolders";
import {
  Repository,
  ErrorWithStatus,
  Unauthorized,
} from "../../infra/interfaces/Repository";
import { UserModel } from "../../domain";

const findUser = (email: string) => (repository: Repository) =>
  pipe(
    repository.findUserByEmail(email),
    chain(orUnauthorizedWith(`Try to login with an inactive user ${email}`))
  );

const checkPassword = (password: string) => (
  user: UserModel
): TaskEither<ErrorWithStatus, UserModel> => {
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
  user: UserModel
): TaskEither<ErrorWithStatus, { token: string }> => {
  const jwtToken = generatingJwt(user);
  return right({ token: jwtToken });
};

const generateTokenWithPassword = (password: string) =>
  flow(chain(checkPassword(password)), chain(generateToken));

export default (repository: Repository, logger: Logger): Router => {
  const router = Router();

  router.post("/", validator(loginSchema, logger), (req, res) =>
    pipe(
      pipe(repository, findUser(req.body.email)),
      generateTokenWithPassword(req.body.password),
      bimap(
        (err) => {
          logger.error(
            `error while login ${req.body.email} : ` + err.error.message ||
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
      foldToOk(res)
    )()
  );

  return router;
};
