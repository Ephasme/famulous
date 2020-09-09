import { KnexPersist } from "../RepositoryPostgres";
import { AccountDeletedModel } from "../entities/AccountDeletedModel";
import { AccountDeleted } from "../../domain";
import { pipe, constVoid } from "fp-ts/lib/function";
import { tryCatchNormalize } from "../FpUtils";
import { map, mapLeft } from "fp-ts/lib/TaskEither";
import { InternalError } from "../interfaces/Repository";

export const saveAccountDeleted: KnexPersist<AccountDeleted> = ({ knex }) => (
  entity
) =>
  pipe(
    tryCatchNormalize(() =>
      knex<AccountDeletedModel>("account_events")
        .insert({
          id: entity.id,
          type: entity.type,
          aggregate_id: entity.aggregate.id,
          aggregate_type: entity.aggregate.type,
        })
        .then((x) =>
          console.log("inserted account events: " + JSON.stringify(x))
        )
    ),
    mapLeft(InternalError),
    map(constVoid)
  );
