import * as uuid from "uuid";
import {
  TransactionEvent,
  TRANSACTION,
  AggregateInfo,
  TransactionType,
  With,
} from "../..";

export const TRANSACTION_CREATED = "transaction.created";
export type TransactionCreatedType = typeof TRANSACTION_CREATED;

export interface AccountTarget {
  account_id: string;
  amount: number;
}

interface Payload {
  account_id: string;
  targets: AccountTarget[];
}

export interface TransactionCreated
  extends TransactionEvent<TransactionCreatedType>,
    With<Payload> {}

class TransactionCreatedImpl implements TransactionCreated {
  static make(
    id: string,
    accountId: string,
    targets: AccountTarget[]
  ): TransactionCreated {
    return new TransactionCreatedImpl(
      uuid.v4(),
      TRANSACTION_CREATED,
      { id, type: TRANSACTION },
      Date.now(),
      { account_id: accountId, targets }
    );
  }

  private constructor(
    readonly id: string,
    readonly type: TransactionCreatedType,
    readonly aggregate: AggregateInfo<TransactionType>,
    readonly createdAt: number,
    readonly payload: Payload
  ) {}
}

export const transactionCreated = TransactionCreatedImpl.make;
