export const ACCOUNT = "account";
export type AccountType = typeof ACCOUNT;

export const ACCOUNT_STATES = ["opened", "closed"];
export type AccountStates = typeof ACCOUNT_STATES[number];

export type AccountModel = {
  id: string;
  state: AccountStates;
  name: string;
  balance: number;
  currency: string;
};
