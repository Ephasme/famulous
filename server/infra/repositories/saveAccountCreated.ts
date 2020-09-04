import { KnexPersist } from "../RepositoryPostgres";
import { AccountCreatedModel } from "../entities/AccountCreatedModel";
import { InternalError, AccountCreated } from "../../domain";
import { pipe, constVoid } from "fp-ts/lib/function";
import { mapLeft, map } from "fp-ts/lib/TaskEither";
import { tryCatchNormalize } from "../FpUtils";

export const saveAccountCreated: KnexPersist<AccountCreated> = ({ knex }) => (
  entity
) =>
  pipe(
    tryCatchNormalize(() =>
      knex<AccountCreatedModel>("account_events")
        .insert({
          id: entity.id,
          type: entity.type,
          aggregate_id: entity.aggregate.id,
          aggregate_type: entity.aggregate.type,
          created_currency: entity.payload.currency,
          created_name: entity.payload.name,
          created_user_id: entity.payload.userId,
        })
        .then((x) =>
          console.log("inserted account events: " + JSON.stringify(x))
        )
    ),
    mapLeft(InternalError),
    map(constVoid)
  );
