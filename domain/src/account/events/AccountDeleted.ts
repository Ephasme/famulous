import * as uuid from "uuid";
import { AggregateInfo } from "../../AggregateEvent";
import { AccountEvent } from "./AccountEvent";
import { ACCOUNT, AccountType } from "../states/AccountState";

export const ACCOUNT_DELETED = "account.deleted";
export type AccountDeletedType = typeof ACCOUNT_DELETED;

export interface AccountDeleted extends AccountEvent<AccountDeletedType> {}

class AccountDeletedImpl implements AccountDeleted {
  static make(id: string): AccountDeleted {
    return new AccountDeletedImpl(
      uuid.v4(),
      ACCOUNT_DELETED,
      { id, type: ACCOUNT },
      Date.now()
    );
  }

  private constructor(
    readonly id: string,
    readonly type: AccountDeletedType,
    readonly aggregate: AggregateInfo<AccountType>,
    readonly createdAt: number
  ) {}
}

export const accountDeleted = AccountDeletedImpl.make;
