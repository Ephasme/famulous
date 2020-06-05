import { Express } from "express";
import * as passport from "passport";

import { Repository } from "../../domain";
import Logger from "../interfaces/Logger";

const makePassportMiddleware = (
  app: Express,
  repository: Repository,
  logger: Logger
): passport.PassportStatic => {
  app.use(passport.initialize());

  return passport;
};

export default makePassportMiddleware;
