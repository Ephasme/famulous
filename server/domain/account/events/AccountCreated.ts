import * as uuid from "uuid";
import { AccountEvent, ACCOUNT, AggregateInfo, AccountType } from "../..";

export const ACCOUNT_CREATED = "account.created";
export type AccountCreatedType = typeof ACCOUNT_CREATED;

interface Payload {
  account: {
    name: string;
  };
}

export interface AccountCreated
  extends AccountEvent<AccountCreatedType>,
    Payload {}

class AccountCreatedImpl implements AccountCreated {
  static make(id: string, name: string): AccountCreated {
    return new AccountCreatedImpl(
      uuid.v4(),
      ACCOUNT_CREATED,
      { id, type: ACCOUNT },
      Date.now(),
      { name }
    );
  }

  private constructor(
    readonly id: string,
    readonly type: AccountCreatedType,
    readonly aggregate: AggregateInfo<AccountType>,
    readonly createdAt: number,
    readonly account: { name: string }
  ) {}
}

export const accountCreated = AccountCreatedImpl.make;
