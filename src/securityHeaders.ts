// Applied to every response via next.config.ts headers(). Live Preview
// frames the public site inside /admin, which is same-origin — so frame
// protection must stop at SAMEORIGIN, not DENY.
export const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];
