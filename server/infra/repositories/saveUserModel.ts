import { Dependencies } from "../RepositoryPostgres";
import { UserCreated, UserModel } from "../../domain";
import { pipe, constVoid } from "fp-ts/lib/function";
import { tryCatchNormalize } from "../FpUtils";
import { mapLeft, map } from "fp-ts/lib/TaskEither";
import { InternalError } from "../interfaces/Repository";

export const saveUserModel = ({ knex }: Dependencies) => (
  event: UserCreated
) => {
  return pipe(
    tryCatchNormalize(() =>
      knex<UserModel>("user")
        .insert({
          id: event.aggregate.id,
          email: event.payload.email,
          password: event.payload.password,
          salt: event.payload.salt,
          state: "active",
        })
        .then((x) => {
          console.log("inserted users: " + JSON.stringify(x));
        })
    ),
    mapLeft(InternalError),
    map(constVoid)
  );
};
