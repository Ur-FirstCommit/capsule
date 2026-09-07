import { describe, expect, it } from "vitest";
import { isFutureDate } from "./format";

describe("isFutureDate", () => {
  it("rejects invalid and past dates", () => {
    expect(isFutureDate("not-a-date")).toBe(false);
    expect(isFutureDate("2020-01-01T00:00:00.000Z")).toBe(false);
  });
  it("accepts a future date", () => {
    expect(isFutureDate("2030-01-01T00:00:00.000Z", Date.parse("2029-01-01T00:00:00.000Z"))).toBe(true);
  });
});
