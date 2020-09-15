import { KnexPersist } from "../RepositoryPostgres";
import { pipe, constVoid } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { tryCatch } from "../FpUtils";
import { TransactionCreated } from "../../domain";
import { Transaction } from "../orm/entities/Transaction";
import { InternalError } from "../../domain/interfaces";
import * as dao from "../orm/entities/events/TransactionCreated";

export const saveTransactionCreated: KnexPersist<TransactionCreated> = ({
  em,
}) => (entity) =>
  pipe(
    tryCatch(() => em.save(dao.TransactionCreated.from(entity))),
    TE.mapLeft(InternalError),
    TE.map((created) => {
      em.save(Transaction, { account: { id: created.account_id } });
    }),
    TE.map(constVoid)
  );
