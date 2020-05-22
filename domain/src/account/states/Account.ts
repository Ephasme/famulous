import { AnyAccountEvent } from "..";
import { CREATED, DELETED } from "../events";

export const OPENED = "opened";
export type OPENED = typeof OPENED;
export const EMPTY = "empty";
export type EMPTY = typeof EMPTY;

export type AnyStateName = OPENED | EMPTY;

export interface AccountState {
  readonly stateName: AnyStateName;
  handleEvent(ev: AnyAccountEvent): AccountState;
}

export class OpenedAccount implements AccountState {
  stateName: AnyStateName = OPENED;
  handleEvent(ev: AnyAccountEvent): AccountState {
    switch (ev.name) {
      case CREATED:
        throw new Error(`Account ${this.name} (id: ${this.id}) is already created.`);
      case DELETED:
        return EmptyAccount;
    }
  }

  constructor(private id: string, private name: string) {}
}

export const EmptyAccount: AccountState = {
  stateName: EMPTY,
  handleEvent(ev: AnyAccountEvent): AccountState {
    switch (ev.name) {
      case CREATED:
        return new OpenedAccount(ev.key, ev.payload.name);
      case DELETED:
        throw new Error("Empty account.");
    }
  },
};
