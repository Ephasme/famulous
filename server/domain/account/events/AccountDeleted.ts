import * as uuid from "uuid";
import { AccountEvent, AggregateInfo, ACCOUNT, AccountType } from "../..";
import { AccountId } from "../../ValueObjects";
import { AbstractAccountEvent } from "./AccountEvent";

export const ACCOUNT_DELETED = "account.deleted";
export type AccountDeletedType = typeof ACCOUNT_DELETED;

export type AccountDeleted = AccountEvent<AccountDeletedType>;

class AccountDeletedImpl
  extends AbstractAccountEvent<AccountDeletedType>
  implements AccountDeleted {
  static make(id: AccountId): AccountDeleted {
    return new AccountDeletedImpl(
      uuid.v4(),
      ACCOUNT_DELETED,
      { id, type: ACCOUNT },
      new Date()
    );
  }

  private constructor(
    id: string,
    eventType: AccountDeletedType,
    aggregate: AggregateInfo<AccountType, AccountId>,
    createdAt: Date
  ) {
    super(id, eventType, aggregate, createdAt);
  }
}

export const accountDeleted = AccountDeletedImpl.make;
