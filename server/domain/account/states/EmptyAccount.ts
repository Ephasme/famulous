import {
  AnyAccountEvent,
  AnyAccountState,
  ACCOUNT_CREATED,
  OpenedAccount,
  ACCOUNT_DELETED,
  AccountState,
  ACCOUNT,
} from "../..";
import { right, left, Either } from "fp-ts/lib/Either";

export const EMPTY_ACCOUNT = "empty-account";
export type EmptyAccountType = typeof EMPTY_ACCOUNT;

export class EmptyAccount implements AccountState<EmptyAccountType> {
  model: "account" = "account";
  type: EmptyAccountType = EMPTY_ACCOUNT;
  constructor(public id: string) {}
  handleEvent(ev: AnyAccountEvent): Either<Error, AnyAccountState> {
    switch (ev.type) {
      case ACCOUNT_CREATED:
        return right(
          new OpenedAccount(
            ev.aggregate.id,
            ev.payload.name,
            ev.payload.currency,
            0
          )
        );
      case ACCOUNT_DELETED:
        throw left(new Error("Empty account."));
    }
  }
}
