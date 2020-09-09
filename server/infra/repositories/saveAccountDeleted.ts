import { KnexPersist } from "../RepositoryPostgres";
import { AccountDeletedModel } from "../entities/AccountDeletedModel";
import { AccountDeleted } from "../../domain";
import { pipe, constVoid } from "fp-ts/lib/function";
import { tryCatchNormalize } from "../FpUtils";
import { map, mapLeft } from "fp-ts/lib/TaskEither";
import { InternalError } from "../../domain/interfaces";

export const saveAccountDeleted: KnexPersist<AccountDeleted> = ({ knex }) => (
  entity
) =>
  pipe(
    tryCatchNormalize(() =>
      knex<AccountDeletedModel>("account_events").insert({
        id: entity.id,
        type: entity.type,
        aggregate_id: entity.aggregate.id,
        aggregate_type: entity.aggregate.type,
      })
    ),
    mapLeft(InternalError),
    map(constVoid)
  );
