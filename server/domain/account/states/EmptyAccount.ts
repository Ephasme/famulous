import {
  AnyAccountEvent,
  AnyAccountState,
  ACCOUNT_CREATED,
  OpenedAccount,
  ACCOUNT_DELETED,
} from "../..";

export const EMPTY_ACCOUNT = "empty-account";
export type EmptyAccountType = typeof EMPTY_ACCOUNT;

export class EmptyAccount {
  type: EmptyAccountType = EMPTY_ACCOUNT;
  handleEvent(ev: AnyAccountEvent): AnyAccountState {
    switch (ev.type) {
      case ACCOUNT_CREATED:
        return new OpenedAccount(ev.aggregate.id, ev.payload.name);
      case ACCOUNT_DELETED:
        throw new Error("Empty account.");
    }
  }
}
