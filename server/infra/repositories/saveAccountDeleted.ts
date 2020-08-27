import {
  KnexPersist,
  AccountCreatedModel,
  AccountDeletedModel,
} from "../RepositoryPostgres";
import {
  AccountCreated,
  InternalError,
  EmptyAccount,
  AccountDeleted,
} from "../../domain";
import { pipe, constVoid } from "fp-ts/lib/function";
import { tryCatchNormalize } from "../FpUtils";
import { map, mapLeft } from "fp-ts/lib/TaskEither";

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
