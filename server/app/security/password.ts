import * as crypto from "crypto";

interface HashPasswordResult {
  salt: string;
  hashedPassword: string;
}

const generateHashedPassword = (password: string, salt: string): string =>
  crypto
    .createHash("sha512")
    .update(password + salt)
    .digest("hex");

export const hashPassword = (password: string): HashPasswordResult => {
  const salt = crypto.randomBytes(128).toString("base64");
  const hashedPassword = generateHashedPassword(password, salt);

  return {
    salt,
    hashedPassword,
  };
};

export const checkPassword = (
  password: string,
  salt: string,
  hashedPassword: string
): boolean => hashedPassword === generateHashedPassword(password, salt);
