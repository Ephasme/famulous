import * as jwt from "jsonwebtoken";
import { UserModel } from "../../domain";

const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";

export const generatingJwt = ({ id, email }: UserModel): string => {
  const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60; // expiration = 1 hour later

  return jwt.sign({ id, email, exp: expirationTime }, jwtSecret);
};
