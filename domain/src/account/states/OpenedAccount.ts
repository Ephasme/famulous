import { EmptyAccount } from "./EmptyAccount";
import { AnyAccountEvent } from "../events/AccountEvent";
import { AnyAccountState } from "./AccountState";
import { ACCOUNT_CREATED } from "../events/AccountCreated";
import { ACCOUNT_DELETED } from "../events/AccountDeleted";

export const OPENED_ACCOUNT = "opened-account";
export type OpenedAccountType = typeof OPENED_ACCOUNT;

export class OpenedAccount {
  type: OpenedAccountType = OPENED_ACCOUNT;
  handleEvent(ev: AnyAccountEvent): AnyAccountState {
    switch (ev.type) {
      case ACCOUNT_CREATED:
        throw new Error(
          `Account ${this.name} (id: ${this.id}) is already created.`
        );
      case ACCOUNT_DELETED:
        return new EmptyAccount();
    }
  }
  constructor(readonly id: string, readonly name: string) {}
}
