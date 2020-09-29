import * as uuid from "uuid";
import {
  TransactionEvent,
  TRANSACTION,
  AggregateInfo,
  TransactionType,
  With,
  TransactionId,
  AccountId,
} from "../..";
import { AbstractTransactionEvent } from "./TransactionEvent";

export const TRANSACTION_CREATED = "transaction.created";
export type TransactionCreatedType = typeof TRANSACTION_CREATED;

interface Payload {
  readonly accountId: AccountId;
  readonly amount: number;
  readonly label?: string;
}

export interface TransactionCreated
  extends TransactionEvent<TransactionCreatedType>,
    With<Payload> {}

class TransactionCreatedImpl
  extends AbstractTransactionEvent<TransactionCreatedType>
  implements TransactionCreated {
  static make({
    id,
    accountId,
    amount,
    label,
  }: {
    id: TransactionId;
    accountId: AccountId;
    amount: number;
    label?: string;
  }): TransactionCreated {
    return new TransactionCreatedImpl(
      uuid.v4(),
      TRANSACTION_CREATED,
      { id, type: TRANSACTION },
      new Date(),
      { accountId, amount, label }
    );
  }

  private constructor(
    id: string,
    eventType: TransactionCreatedType,
    aggregate: AggregateInfo<TransactionType, TransactionId>,
    createdAt: Date,
    public readonly payload: Payload
  ) {
    super(id, eventType, aggregate, createdAt);
  }
}

export const transactionCreated = TransactionCreatedImpl.make;
