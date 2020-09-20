import { Timestamps } from "../Timestamps";

export const ACCOUNT = "account";
export type AccountType = typeof ACCOUNT;

export const ACCOUNT_STATES = ["opened", "closed"];
export type AccountStates = typeof ACCOUNT_STATES[number];

export type LedgerEntry = {
  amount: number;
  createdAt: Date;
  description?: string;
  payee?: string;
};
export type Ledger = Record<string, LedgerEntry>;

export type AccountModel = {
  id: string;
  state: AccountStates;
  name: string;
  balance: number;
  currency: string;
  transactions: Ledger;
} & Timestamps;
