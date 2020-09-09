export type AnyAccountState = "opened" | "closed";

export type AccountModel = {
  id: string;
  state: AnyAccountState;
  name: string;
  balance: number;
  currency: string;
};
