import { Timestamps } from "../Timestamps";

export const TRANSACTION = "transaction";
export type TransactionType = typeof TRANSACTION;

export type TransactionModel = {
  id: string;
} & Timestamps;
