import { Timestamps } from "../Timestamps";
import { TransactionId } from "../ValueObjects";

export const TRANSACTION = "transaction";
export type TransactionType = typeof TRANSACTION;

export type TransactionModel = {
  id: TransactionId;
} & Timestamps;
