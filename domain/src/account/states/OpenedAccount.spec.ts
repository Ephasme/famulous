import { OpenedAccount } from "./OpenedAccount";
import { EMPTY_ACCOUNT } from "./EmptyAccount";
import { accountDeleted } from "../events/AccountDeleted";
import { accountCreated } from "../events/AccountCreated";

describe("OpenedAccount", () => {
  it("should be in empty state when given a Deleted event", () => {
    const before = new OpenedAccount("someid", "somename");
    const ev = accountDeleted("someid");
    const after = before.handleEvent(ev);

    if (after.type !== EMPTY_ACCOUNT) throw new Error("Incorrect type");
  });

  it("should fail when received Created event", () => {
    const before = new OpenedAccount("someid", "somename");
    expect(() =>
      before.handleEvent(accountCreated("someid2", "somename2"))
    ).toThrow();
  });
});
