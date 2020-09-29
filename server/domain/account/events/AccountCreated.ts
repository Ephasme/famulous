import * as uuid from "uuid";
import { AccountEvent, AggregateInfo, With, ACCOUNT, AccountType } from "../..";
import { AccountId, UserId } from "../../ValueObjects";
import { AbstractAccountEvent } from "./AccountEvent";

export const ACCOUNT_CREATED = "account.created";
export type AccountCreatedType = typeof ACCOUNT_CREATED;

interface Payload {
  readonly name: string;
  readonly userId: UserId;
  readonly currency: string;
}

export interface AccountCreated
  extends AccountEvent<AccountCreatedType>,
    With<Payload> {}

class AccountCreatedImpl
  extends AbstractAccountEvent<AccountCreatedType>
  implements AccountCreated {
  static make(
    id: AccountId,
    name: string,
    userId: UserId,
    currency: string
  ): AccountCreated {
    return new AccountCreatedImpl(
      uuid.v4(),
      ACCOUNT_CREATED,
      { id, type: ACCOUNT },
      new Date(),
      { name, userId, currency }
    );
  }

  private constructor(
    id: string,
    eventType: AccountCreatedType,
    aggregate: AggregateInfo<AccountType, AccountId>,
    createdAt: Date,
    readonly payload: Payload
  ) {
    super(id, eventType, aggregate, createdAt);
  }
}

export const accountCreated = AccountCreatedImpl.make;
