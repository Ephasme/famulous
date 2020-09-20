import { pipe, constVoid } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { tryCatch } from "../FpUtils";
import { TransactionCreated } from "../../domain";
import { AsyncResult } from "../../domain/interfaces";
import * as dao from "../entities/events/TransactionCreated";
import { PersistDependencies } from "./persist";
import { Transaction } from "../entities/Transaction";
import { Account } from "../entities/Account";
import { BALANCE } from "../entities/AccountSQL";

export const saveTransactionCreated = ({ em }: PersistDependencies) => (
  event: TransactionCreated
): AsyncResult<void> =>
  pipe(
    tryCatch(() => em.save(dao.TransactionCreated.from(event))),
    TE.map(() =>
      Transaction.create({
        id: event.aggregate.id,
        createdAt: event.createdAt,
        amount: event.payload.amount,
        accountId: event.payload.accountId,
        description: event.payload.description,
        payee: event.payload.payee,
      })
    ),
    TE.chain((transaction) =>
      tryCatch(() => em.save(Transaction, transaction))
    ),
    TE.chain((transaction) =>
      tryCatch(() => {
        return em
          .createQueryBuilder()
          .update(Account)
          .set({ balance: () => `${BALANCE} + :delta` })
          .where({ id: transaction.account.id })
          .setParameters({ delta: transaction.amount })
          .execute();
      })
    ),
    TE.map(constVoid)
  );
