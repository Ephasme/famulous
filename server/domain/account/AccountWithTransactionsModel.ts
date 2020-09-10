import { AccountTarget } from "..";

type Transaction = {
  id: string;
  targets: AccountTarget[];
};

export type AccountWithTransactionsModel = {
  id: string;
  state: "opened" | "closed";
  name: string;
  balance: number;
  currency: string;
  transactions: Transaction[];
};
