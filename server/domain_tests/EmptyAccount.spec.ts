import {
  EmptyAccount,
  accountCreated,
  OPENED_ACCOUNT,
  accountDeleted,
} from "../domain";

describe("EmptyAccount", () => {
  it("should be in opened state when given a Created event", () => {
    const before = new EmptyAccount();
    const ev = accountCreated("someid", "somename");
    const after = before.handleEvent(ev);

    if (after.type !== OPENED_ACCOUNT) throw new Error("Incorrect type");

    expect(after.id).toBe("someid");
    expect(after.name).toBe("somename");
  });

  it("should fail when received Deleted event", () => {
    const before = new EmptyAccount();
    expect(() => before.handleEvent(accountDeleted("someid"))).toThrow();
  });
});
