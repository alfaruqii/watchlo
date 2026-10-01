/**
 * @jest-environment node
 */

import { generateInternalToken, verifyInternalToken } from "@/lib/security";

describe("Security Token Utility", () => {
  it("generates a valid signed token that verifies successfully", async () => {
    const token = await generateInternalToken();
    expect(typeof token).toBe("string");
    expect(token.includes(".")).toBe(true);

    const isValid = await verifyInternalToken(token);
    expect(isValid).toBe(true);
  });

  it("rejects undefined, empty, or malformed tokens", async () => {
    expect(await verifyInternalToken(undefined)).toBe(false);
    expect(await verifyInternalToken("")).toBe(false);
    expect(await verifyInternalToken("invalid-token-no-dot")).toBe(false);
    expect(await verifyInternalToken("abc.def")).toBe(false);
  });

  it("rejects expired tokens", async () => {
    // 25 hours ago
    const pastTimestamp = Date.now() - 25 * 60 * 60 * 1000;
    const fakeExpiredToken = `${pastTimestamp}.dummyhash`;
    expect(await verifyInternalToken(fakeExpiredToken)).toBe(false);
  });
});
