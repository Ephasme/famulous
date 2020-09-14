import * as uuid from "uuid";
import { AccountEvent, AggregateInfo, ACCOUNT, AccountType } from "../..";
import { AbstractAccountEvent } from "./AccountEvent";

export const ACCOUNT_DELETED = "account.deleted";
export type AccountDeletedType = typeof ACCOUNT_DELETED;

export type AccountDeleted = AccountEvent<AccountDeletedType>;

class AccountDeletedImpl
  extends AbstractAccountEvent<AccountDeletedType>
  implements AccountDeleted {
  static make(id: string): AccountDeleted {
    return new AccountDeletedImpl(
      uuid.v4(),
      ACCOUNT_DELETED,
      { id, type: ACCOUNT },
      Date.now()
    );
  }

  private constructor(
    id: string,
    event_type: AccountDeletedType,
    aggregate: AggregateInfo<AccountType>,
    createdAt: number
  ) {
    super(id, event_type, aggregate, createdAt);
  }
}

export const accountDeleted = AccountDeletedImpl.make;
