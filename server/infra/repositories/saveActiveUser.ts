import { KnexPersist } from "../RepositoryPostgres";
import { UserModel } from "../entities/UserModel";
import { ActiveUser, USER, InternalError } from "../../domain";
import { tryCatchNormalize } from "../FpUtils";
import { pipe, constVoid } from "fp-ts/lib/function";
import { map, mapLeft } from "fp-ts/lib/TaskEither";

export const saveActiveUser: KnexPersist<ActiveUser> = ({ knex }) => (entity) =>
  pipe(
    tryCatchNormalize(() =>
      knex<UserModel>(USER).insert({
        email: entity.email,
        id: entity.id,
        password: entity.password,
        salt: entity.salt,
        state: entity.type,
      })
    ),
    mapLeft(InternalError),
    map(constVoid)
  );
