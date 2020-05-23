import {
  OpenedAccount,
  EmptyAccount,
  OpenedAccountType,
  EmptyAccountType,
  AnyAccountEvent,
} from "../..";

export type AnyAccountState = OpenedAccount | EmptyAccount;
export type AnyAccountStateType = OpenedAccountType | EmptyAccountType;

export const ACCOUNT = "account";
export type AccountType = typeof ACCOUNT;

export interface AccountState {
  type: AnyAccountStateType;
  handleEvent(ev: AnyAccountEvent): AnyAccountState;
}
