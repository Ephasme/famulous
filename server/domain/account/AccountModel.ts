export const ACCOUNT = "account";
export type AccountType = typeof ACCOUNT;

export type AccountStates = "opened" | "closed";

export type AccountModel = {
  id: string;
  state: AccountStates;
  name: string;
  balance: number;
  currency: string;
};
