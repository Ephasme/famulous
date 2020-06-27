import { Express } from "express";
import * as passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import { Repository, ACTIVE_USER, EMPTY_USER, NotFound } from "../../domain";
import Logger from "../interfaces/Logger";
import { chain, right, left, fold } from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { task } from "fp-ts/lib/Task";

const makePassportMiddleware = (
  app: Express,
  repository: Repository,
  logger: Logger
): passport.PassportStatic => {
  app.use(passport.initialize());

  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || "default_jwt_secret",
  };

  passport.use(
    new JwtStrategy(opts, (jwtPayload, done) =>
      pipe(
        repository.findUserById(jwtPayload.id),
        chain((user) => {
          if (user.type === EMPTY_USER) {
            return left(NotFound("User not found during authentication"));
          } else if (user.type !== ACTIVE_USER) {
            return left(NotFound("Try to authenticate with an inactive user"));
          } else {
            logger.info(`Succesful authentication: ${user.email}`);
            return right(user);
          }
        }),
        fold(
          (err) => task.of(done(err.error, false)),
          (user) => task.of(done(null, user))
        )
      )()
    )
  );

  return passport;
};

export default makePassportMiddleware;
