import * as uuid from "uuid";
import { AccountEvent, AggregateInfo, With, ACCOUNT, AccountType } from "../..";

export const ACCOUNT_CREATED = "account.created";
export type AccountCreatedType = typeof ACCOUNT_CREATED;

interface Payload {
  name: string;
  userId: string;
  currency: string;
}

export interface AccountCreated
  extends AccountEvent<AccountCreatedType>,
    With<Payload> {}

class AccountCreatedImpl implements AccountCreated {
  static make(
    id: string,
    name: string,
    userId: string,
    currency: string
  ): AccountCreated {
    return new AccountCreatedImpl(
      uuid.v4(),
      ACCOUNT_CREATED,
      { id, type: ACCOUNT },
      Date.now(),
      { name, userId, currency }
    );
  }

  private constructor(
    readonly id: string,
    readonly type: AccountCreatedType,
    readonly aggregate: AggregateInfo<AccountType>,
    readonly createdAt: number,
    readonly payload: Payload
  ) {}
}

export const accountCreated = AccountCreatedImpl.make;
