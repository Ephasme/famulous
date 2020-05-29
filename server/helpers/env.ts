const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE,
} = process.env;

export const postgresHost = POSTGRES_HOST;
export const postgresPort = POSTGRES_PORT
  ? parseInt(POSTGRES_PORT, 10)
  : undefined;
export const postgresUser = POSTGRES_USER;
export const postgresPassword = POSTGRES_PASSWORD;
export const postgresDatabase = POSTGRES_DATABASE || "famulous";

if (!postgresHost) {
  throw new Error("Missing environment variable : POSTGRES_HOST");
}
if (!postgresPort) {
  throw new Error("Missing environment variable : POSTGRES_PORT");
}
if (!postgresUser) {
  throw new Error("Missing environment variable : POSTGRES_USER");
}
if (!postgresPassword) {
  throw new Error("Missing environment variable : POSTGRES_PASSWORD");
}
