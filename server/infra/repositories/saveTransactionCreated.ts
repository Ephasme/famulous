import { pipe, constVoid } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { tryCatch } from "../FpUtils";
import { TransactionCreated } from "../../domain";
import { AsyncResult } from "../../domain/interfaces";
import { PersistDependencies } from "./persist";
import { TransactionCreatedDao, TransactionDao } from "../entities/Transaction";
import { AccountDao } from "../entities/Account";
import { BALANCE } from "../entities/Account";

export const saveTransactionCreated = ({ em }: PersistDependencies) => (
  event: TransactionCreated
): AsyncResult<void> =>
  pipe(
    tryCatch(() => em.save(TransactionCreatedDao.from(event))),
    TE.map(() =>
      TransactionDao.create({
        id: event.aggregate.id,
        createdAt: event.createdAt,
        amount: event.payload.amount,
        accountId: event.payload.accountId,
        label: event.payload.label,
      })
    ),
    TE.chain((transaction) =>
      tryCatch(() => em.save(TransactionDao, transaction))
    ),
    TE.chain((transaction) =>
      tryCatch(() => {
        return em
          .createQueryBuilder()
          .update(AccountDao)
          .set({ balance: () => `${BALANCE} + :delta` })
          .where({ id: transaction.account.id })
          .setParameters({ delta: transaction.amount })
          .execute();
      })
    ),
    TE.map(constVoid)
  );
