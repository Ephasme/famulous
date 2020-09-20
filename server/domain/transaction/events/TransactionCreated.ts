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

interface Payload {
  readonly accountId: string;
  readonly amount: number;
  readonly payee?: string;
  readonly description?: string;
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
    description,
    payee,
  }: {
    id: string;
    accountId: string;
    amount: number;
    description?: string;
    payee?: string;
  }): TransactionCreated {
    return new TransactionCreatedImpl(
      uuid.v4(),
      TRANSACTION_CREATED,
      { id, type: TRANSACTION },
      new Date(),
      { accountId, amount, description, payee }
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
