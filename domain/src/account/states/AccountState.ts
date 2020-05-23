import { OpenedAccount, OpenedAccountType } from "./OpenedAccount";
import { EmptyAccount, EmptyAccountType } from "./EmptyAccount";
import { AnyAccountEvent } from "../events/AccountEvent";

export type AnyAccountState = OpenedAccount | EmptyAccount;
export type AnyAccountStateType = OpenedAccountType | EmptyAccountType;

export const ACCOUNT = "account";
export type AccountType = typeof ACCOUNT;

export interface AccountState {
  type: AnyAccountStateType;
  handleEvent(ev: AnyAccountEvent): AnyAccountState;
}
