import { Express } from "express";
import * as passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import { Repository, NotFound } from "../../domain";
import Logger from "../interfaces/Logger";
import * as TE from "fp-ts/lib/TaskEither";
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
        TE.chain(
          TE.fromOption(() => NotFound("User not found during authentication"))
        ),
        TE.map((u) => {
          logger.info(`Successful authentication: ${u.email}`);
          return u;
        }),
        TE.fold(
          (err) => task.of(done(err.error, false)),
          (user) => task.of(done(null, user))
        )
      )()
    )
  );

  return passport;
};

export default makePassportMiddleware;
