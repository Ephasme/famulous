import { OpenedAccount } from "./OpenedAccount";
import { AnyAccountState } from "./AccountState";
import { AnyAccountEvent } from "../events/AccountEvent";
import { ACCOUNT_CREATED } from "../events/AccountCreated";
import { ACCOUNT_DELETED } from "../events/AccountDeleted";

export const EMPTY_ACCOUNT = "empty-account";
export type EmptyAccountType = typeof EMPTY_ACCOUNT;

export class EmptyAccount {
  type: EmptyAccountType = EMPTY_ACCOUNT;
  handleEvent(ev: AnyAccountEvent): AnyAccountState {
    switch (ev.type) {
      case ACCOUNT_CREATED:
        return new OpenedAccount(ev.aggregate.id, ev.account.name);
      case ACCOUNT_DELETED:
        throw new Error("Empty account.");
    }
  }
  constructor() {}
}
