import { pipe, constVoid } from "fp-ts/lib/function";
import * as A from "fp-ts/lib/Array";
import * as TE from "fp-ts/lib/TaskEither";
import * as O from "fp-ts/lib/Option";
import { tryCatch } from "../FpUtils";
import { TransactionCreated } from "../../domain";
import { Transaction } from "../entities/Transaction";
import { InternalError, NotFound } from "../../domain/interfaces";
import * as dao from "../entities/events/TransactionCreated";
import { EntityManager } from "typeorm";
import { Account } from "../entities/Account";
import { TransactionTarget } from "../entities/TransactionTarget";

export const saveTransactionCreated = ({ em }: { em: EntityManager }) => (
  event: TransactionCreated
) =>
  pipe(
    tryCatch(() => em.save(dao.TransactionCreated.from(event))),
    TE.map(() =>
      Transaction.create({
        account: { id: event.payload.account_id } as Account,
        id: event.aggregate.id,
        createdAt: event.createdAt,
        targets: pipe(
          event.payload.targets,
          A.map((target) => {
            const targetDao = new TransactionTarget();
            targetDao.amount = target.amount;
            targetDao.target = { id: target.account_id } as Account;
            targetDao.payee = "no-payee";
            return targetDao;
          })
        ),
      })
    ),
    TE.chain((dao) => tryCatch(() => em.save(Transaction, dao))),
    TE.mapLeft(InternalError),
    TE.map(constVoid)
  );
