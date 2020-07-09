import {
  EmptyAccount,
  accountCreated,
  OPENED_ACCOUNT,
  accountDeleted,
} from "../..";
import { Right } from "fp-ts/lib/Either";
import { OpenedAccount } from "./OpenedAccount";

describe("EmptyAccount", () => {
  it("should be in opened state when given a Created event", () => {
    const before = new EmptyAccount();
    const ev = accountCreated("someid", "somename", "user_id", "EUR");
    const after = (before.handleEvent(ev) as Right<OpenedAccount>).right;

    if (after.type !== OPENED_ACCOUNT) throw new Error("Incorrect type");

    expect(after.id).toBe("someid");
    expect(after.name).toBe("somename");
    expect(after.currency).toBe("EUR");
    expect(after.balance).toBe(0);
  });

  it("should fail when received Deleted event", () => {
    const before = new EmptyAccount();
    expect(() => before.handleEvent(accountDeleted("someid"))).toThrow();
  });
});
