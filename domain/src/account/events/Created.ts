import * as uuid from "uuid"
import { AccountEvent, ACCOUNT } from "..";

export const CREATED = "account.created";
export type CREATED = typeof CREATED;

type CreatedPayload = { readonly name: string }

export interface Created extends AccountEvent<CREATED, CreatedPayload> {}

class CreatedImpl implements Created {
  static make(accountId: string, accountName: string): Created {
    return new CreatedImpl(
      uuid.v4(),
      CREATED,
      ACCOUNT,
      accountId,
      new Date(),
      { name: accountName }
    );
  }

  private constructor(
    readonly id: string,
    readonly name: CREATED,
    readonly topic: ACCOUNT,
    readonly key: string,
    readonly createdAt: Date,
    readonly payload: CreatedPayload
  ) {}
}

export const created = CreatedImpl.make;
