import { describe, expect, it } from "vitest";

import { securityHeaders } from "./securityHeaders";

describe("securityHeaders", () => {
  it("framed pages stay same-origin only — Payload Live Preview iframes the site", () => {
    expect(securityHeaders).toContainEqual({
      key: "X-Frame-Options",
      value: "SAMEORIGIN",
    });
  });

  it("pins HTTPS for two years including subdomains", () => {
    expect(securityHeaders).toContainEqual({
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains",
    });
  });

  it("stops content-type sniffing on served responses", () => {
    expect(securityHeaders).toContainEqual({
      key: "X-Content-Type-Options",
      value: "nosniff",
    });
  });

  it("keeps full referrers on-site and sends only the origin cross-origin", () => {
    expect(securityHeaders).toContainEqual({
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    });
  });
});
