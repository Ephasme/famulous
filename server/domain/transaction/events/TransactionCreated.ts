import * as uuid from "uuid";
import {
  TransactionEvent,
  TRANSACTION,
  AggregateInfo,
  TransactionType,
  With,
} from "../..";
import { AbstractTransactionEvent } from "./TransactionEvent";

export const TRANSACTION_CREATED = "transaction.created";
export type TransactionCreatedType = typeof TRANSACTION_CREATED;

interface AccountTarget {
  readonly accountId: string;
  readonly amount: number;
}

interface Payload {
  readonly accountId: string;
  readonly targets: AccountTarget[];
}

export interface TransactionCreated
  extends TransactionEvent<TransactionCreatedType>,
    With<Payload> {}

class TransactionCreatedImpl
  extends AbstractTransactionEvent<TransactionCreatedType>
  implements TransactionCreated {
  static make(
    id: string,
    accountId: string,
    targets: AccountTarget[]
  ): TransactionCreated {
    return new TransactionCreatedImpl(
      uuid.v4(),
      TRANSACTION_CREATED,
      { id, type: TRANSACTION },
      new Date(),
      { accountId, targets }
    );
  }

  private constructor(
    id: string,
    eventType: TransactionCreatedType,
    aggregate: AggregateInfo<TransactionType>,
    createdAt: Date,
    public readonly payload: Payload
  ) {
    super(id, eventType, aggregate, createdAt);
  }
}

export const transactionCreated = TransactionCreatedImpl.make;
