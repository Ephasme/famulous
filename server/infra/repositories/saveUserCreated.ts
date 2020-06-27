import { UserCreatedModel, KnexPersist } from "../RepositoryPostgres";
import { UserCreated, InternalError } from "../../domain";
import { pipe, constVoid } from "fp-ts/lib/function";
import { mapLeft, map } from "fp-ts/lib/TaskEither";
import { tryCatchNormalize } from "../FpUtils";

export const saveUserCreated: KnexPersist<UserCreated> = ({ knex }) => (
  entity
) =>
  pipe(
    tryCatchNormalize(() =>
      knex<UserCreatedModel>("user_events").insert({
        id: entity.id,
        type: entity.type,
        aggregate_id: entity.aggregate.id,
        aggregate_type: entity.aggregate.type,
        created_email: entity.payload.email,
        created_password: entity.payload.password,
        created_salt: entity.payload.salt,
      })
    ),
    mapLeft(InternalError),
    map(constVoid)
  );
