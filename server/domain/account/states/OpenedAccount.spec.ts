import {
  OpenedAccount,
  accountDeleted,
  EMPTY_ACCOUNT,
  accountCreated,
} from "../..";
import { Right } from "fp-ts/lib/Either";
import { EmptyAccount } from "./EmptyAccount";

describe("OpenedAccount", () => {
  it("should be in empty state when given a Deleted event", () => {
    const before = new OpenedAccount("someid", "somename", "EUR", 142);
    const ev = accountDeleted("someid");
    const after = (before.handleEvent(ev) as Right<EmptyAccount>).right;

    if (after.type !== EMPTY_ACCOUNT) throw new Error("Incorrect type");
  });

  it("should fail when received Created event", () => {
    const before = new OpenedAccount("someid", "somename", "EUR", 874);
    expect(
      before.handleEvent(
        accountCreated("someid2", "somename2", "user-id", "EUR")
      )._tag
    ).toBe("Left");
  });
});
