import { KnexPersist } from "../RepositoryPostgres";
import { TransactionCreatedModel } from "../entities/TransactionCreatedModel";
import { pipe, constVoid } from "fp-ts/lib/function";
import { mapLeft, map } from "fp-ts/lib/TaskEither";
import { tryCatch } from "../FpUtils";
import { TransactionCreated } from "../../domain";
import { InternalError } from "../../domain/interfaces";

export const saveTransactionCreated: KnexPersist<TransactionCreated> = ({
  knex,
}) => (entity) =>
  pipe(
    tryCatch(() =>
      knex<TransactionCreatedModel>("transaction_events").insert({
        id: entity.id,
        type: entity.event_type,
        aggregate_id: entity.aggregate.id,
        aggregate_type: entity.aggregate.type,
        account_id: entity.payload.account_id,
        targets: JSON.stringify(entity.payload.targets),
      })
    ),
    mapLeft(InternalError),
    map(constVoid)
  );
