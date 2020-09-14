import * as uuid from "uuid";
import { AccountEvent, AggregateInfo, With, ACCOUNT, AccountType } from "../..";
import { AbstractAccountEvent } from "./AccountEvent";

export const ACCOUNT_CREATED = "account.created";
export type AccountCreatedType = typeof ACCOUNT_CREATED;

interface Payload {
  readonly name: string;
  readonly userId: string;
  readonly currency: string;
}

export interface AccountCreated
  extends AccountEvent<AccountCreatedType>,
    With<Payload> {}

class AccountCreatedImpl
  extends AbstractAccountEvent<AccountCreatedType>
  implements AccountCreated {
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
    id: string,
    event_type: AccountCreatedType,
    aggregate: AggregateInfo<AccountType>,
    createdAt: number,
    readonly payload: Payload
  ) {
    super(id, event_type, aggregate, createdAt);
  }
}

export const accountCreated = AccountCreatedImpl.make;
