import * as uuid from "uuid"
import { AccountEvent, ACCOUNT } from "..";

export const DELETED = "account.deleted";
export type DELETED = typeof DELETED;

export type DeletedPayload = { accountId: string }

export interface Deleted extends AccountEvent<DELETED, DeletedPayload> {}


class DeletedImpl implements Deleted {
  static make(accountId: string, payload: DeletedPayload): Deleted {
    return new DeletedImpl(
      uuid.v4(),
      DELETED,
      ACCOUNT,
      accountId,
      new Date(),
      payload
    );
  }

  private constructor(
    readonly id: string,
    readonly name: DELETED,
    readonly topic: ACCOUNT,
    readonly key: string,
    readonly createdAt: Date,
    readonly payload: DeletedPayload
  ) {}
}

export const remove = DeletedImpl.make;
