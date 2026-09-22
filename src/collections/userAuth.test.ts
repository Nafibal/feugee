import { describe, expect, it } from "vitest";

import { adminAuth, adminSessionSeconds } from "./userAuth";

// Payload signs admin tokens for 7200 seconds unless told otherwise.
const payloadDefaultSessionSeconds = 7200;

describe("adminAuth", () => {
  it("expires admin sessions explicitly, sooner than Payload's 2-hour default", () => {
    expect(adminSessionSeconds).toBeLessThan(payloadDefaultSessionSeconds)
    expect(adminAuth(false).tokenExpiration).toBe(adminSessionSeconds)
  });

  it("marks the session cookie Secure in production", () => {
    expect(adminAuth(true).cookies?.secure).toBe(true)
  });

  it("leaves the session cookie usable over plain HTTP in local dev", () => {
    expect(adminAuth(false).cookies?.secure).toBe(false)
  });
});
