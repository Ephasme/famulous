import { Timestamps } from "../Timestamps";
import { AccountId } from "../ValueObjects";

export const ACCOUNT = "account";
export type AccountType = typeof ACCOUNT;

export const ACCOUNT_STATES = ["opened", "closed"];
export type AccountStates = typeof ACCOUNT_STATES[number];

export type LedgerEntry = {
  amount: number;
  createdAt: Date;
  label?: string;
};
export type Ledger = Record<string, LedgerEntry>;

export type AccountModel = {
  id: AccountId;
  state: AccountStates;
  name: string;
  balance: number;
  currency: string;
  transactions: Ledger;
} & Timestamps;
