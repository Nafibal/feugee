import type { IncomingAuthType } from "payload"

// One hour — half of Payload's 2-hour default. Agency editors log in for a
// working session, not a day.
export const adminSessionSeconds = 3600

export function adminAuth(secureCookie: boolean): IncomingAuthType {
  return {
    tokenExpiration: adminSessionSeconds,
    cookies: {
      secure: secureCookie,
    },
  }
}
