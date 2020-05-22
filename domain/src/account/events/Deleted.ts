import * as uuid from "uuid"
import { AccountEvent, ACCOUNT } from "..";

export const DELETED = "account.deleted";
export type DELETED = typeof DELETED;

export type DeletedPayload = {}

export interface Deleted extends AccountEvent<DELETED, DeletedPayload> {}


class DeletedImpl implements Deleted {
  static make(accountId: string): Deleted {
    return new DeletedImpl(
      uuid.v4(),
      DELETED,
      ACCOUNT,
      accountId,
      Date.now(),
      {}
    );
  }

  private constructor(
    readonly id: string,
    readonly name: DELETED,
    readonly topic: ACCOUNT,
    readonly key: string,
    readonly createdAt: number,
    readonly payload: DeletedPayload
  ) {}
}

export const deleted = DeletedImpl.make;
