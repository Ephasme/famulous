import { PassportStatic } from "passport";
import { RequestHandler } from "express";

export type Authenticator = () => RequestHandler;

export const authenticatorFactory = (passport: PassportStatic): Authenticator =>
  passport.authenticate("jwt", { session: false });
