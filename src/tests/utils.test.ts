import { isDemoMode } from "@/lib/utils";

describe("isDemoMode", () => {
  it("defaults to mock-friendly demo mode", () => {
    expect(isDemoMode(undefined)).toBe(true);
    expect(isDemoMode("true")).toBe(true);
    expect(isDemoMode("false")).toBe(false);
  });
});
