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
  readonly account_id: string;
  readonly amount: number;
}

interface Payload {
  readonly account_id: string;
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
      { account_id: accountId, targets }
    );
  }

  private constructor(
    id: string,
    event_type: TransactionCreatedType,
    aggregate: AggregateInfo<TransactionType>,
    createdAt: Date,
    public readonly payload: Payload
  ) {
    super(id, event_type, aggregate, createdAt);
  }
}

export const transactionCreated = TransactionCreatedImpl.make;
