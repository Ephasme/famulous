import { Express } from "express";
import * as passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import { Repository, USER, ACTIVE_USER } from "../../domain";
import Logger from "../interfaces/Logger";

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
    new JwtStrategy(opts, async (jwtPayload, done) => {
      const user = await repository.fetchOne(USER, jwtPayload.id);
      if (!user) {
        return done(new Error("User not found while authentication"), false);
      }
      if (user.type !== ACTIVE_USER) {
        return done(
          new Error("Try to authenticate with an inactive user"),
          false
        );
      }

      logger.info(`Succesful authentication: ${user.email}`);
      done(null, user);
    })
  );

  return passport;
};

export default makePassportMiddleware;
