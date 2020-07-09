import {
  OpenedAccount,
  EmptyAccount,
  OpenedAccountType,
  EmptyAccountType,
  AnyAccountEvent,
  AggregateState,
} from "../..";
import { AnyState } from "../../AnyState";

export type AnyAccountState = OpenedAccount | EmptyAccount;
export type AnyAccountStateType = OpenedAccountType | EmptyAccountType;

export const ACCOUNT = "account";
export type AccountType = typeof ACCOUNT;

export interface AccountState<T extends AnyAccountStateType>
  extends AggregateState<AnyAccountState, AnyAccountEvent, T, AccountType> {
  type: T;
}

export function isAccount(input: AnyState): input is AnyAccountState {
  return input.model === ACCOUNT;
}
