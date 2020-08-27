import { AnyUserState } from "../../domain";
import { hashPassword } from "../security/password";

export const withHashedPassword = (password: string) => (
  user: AnyUserState
) => ({
  user,
  hashResult: hashPassword(password),
});
