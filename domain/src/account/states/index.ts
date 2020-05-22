import { AnyAccountEvent } from "..";
import { OpenedAccount, OpenedAccountType } from "./OpenedAccount";
import { EmptyAccount, EmptyAccountType } from "./EmptyAccount";

export type AnyAccountState = OpenedAccount | EmptyAccount;
export type AnyAccountStateType = OpenedAccountType | EmptyAccountType;

export const ACCOUNT = "account";
export type AccountType = typeof ACCOUNT;

export interface AccountState {
  type: AnyAccountStateType;
  handleEvent(ev: AnyAccountEvent): AnyAccountState;
}
