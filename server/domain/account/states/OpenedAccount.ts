import {
  AnyAccountEvent,
  AnyAccountState,
  ACCOUNT_CREATED,
  ACCOUNT_DELETED,
  EmptyAccount,
} from "../..";
import { AccountState } from "./AccountState";
import { left, Either, right } from "fp-ts/lib/Either";

export const OPENED_ACCOUNT = "opened-account";
export type OpenedAccountType = typeof OPENED_ACCOUNT;

export class OpenedAccount implements AccountState<OpenedAccountType> {
  model: "account" = "account";
  type: OpenedAccountType = OPENED_ACCOUNT;
  handleEvent(ev: AnyAccountEvent): Either<Error, AnyAccountState> {
    switch (ev.type) {
      case ACCOUNT_CREATED:
        return left(
          new Error(`Account ${this.name} (id: ${this.id}) is already created.`)
        );
      case ACCOUNT_DELETED:
        return right(new EmptyAccount());
    }
  }
  constructor(
    readonly id: string,
    readonly name: string,
    readonly currency: string,
    readonly balance: number
  ) {}
}
