import { KnexPersist } from "../RepositoryPostgres";
import { TransactionModel } from "../entities/TransactionModel";
import { TransactionToTargetModel } from "../entities/TransactionToTargetModel";
import { TransactionCreated } from "../../domain";
import { pipe, constVoid } from "fp-ts/lib/function";
import { mapLeft, map } from "fp-ts/lib/TaskEither";
import { tryCatchNormalize } from "../FpUtils";
import { InternalError } from "../../domain/interfaces";

export const saveTransactionModel: KnexPersist<TransactionCreated> = ({
  knex,
}) => (entity) =>
  pipe(
    tryCatchNormalize(async () => {
      await knex<TransactionModel>("transaction").insert({
        id: entity.id,
        account_id: entity.payload.account_id,
      });

      await Promise.all(
        entity.payload.targets.map(({ account_id, amount }) =>
          knex<TransactionToTargetModel>("transaction_to_target").insert({
            transaction_id: entity.id,
            account_id,
            amount,
          })
        )
      );
    }),
    mapLeft(InternalError),
    map(constVoid)
  );
