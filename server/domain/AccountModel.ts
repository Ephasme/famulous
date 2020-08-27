import {
  AnyAccountStateType,
  ErrorWithStatus,
  AnyAccountState,
  OPENED_ACCOUNT,
  OpenedAccount,
  EMPTY_ACCOUNT,
  InternalError,
} from ".";
import * as E from "fp-ts/Either";

export type AccountModel = {
  id: string;
  state: AnyAccountStateType;
  name: string;
  balance: number;
  currency: string;
};

export const AccountModel = {
  toState: ({
    account,
    usersId,
  }: {
    account: AccountModel;
    usersId: string[];
  }): E.Either<ErrorWithStatus, AnyAccountState> => {
    switch (account.state) {
      case OPENED_ACCOUNT:
        return E.right(
          new OpenedAccount(
            account.id,
            account.name,
            account.currency,
            account.balance,
            usersId
          )
        );
      case EMPTY_ACCOUNT:
        return E.left(
          InternalError("Account state is corrupted, should not be empty.")
        );
    }
  },
};
