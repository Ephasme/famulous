export const ACCOUNT = "account";
export type AccountType = typeof ACCOUNT;

export type AccountModel = {
  id: string;
  state: "opened" | "closed";
  name: string;
  balance: number;
  currency: string;
};
