import { describe, expect, it } from "vitest";

import type { AccessArgs } from "payload";

import { publishedRead, publishedWhere } from "./publishedRead";

// The predicate only reads whether a user exists — any stand-in user shape
// will do, so the one unavoidable cast lives here, at the builder boundary.
const argsWith = (user: unknown) => ({ req: { user } }) as AccessArgs;

describe("publishedWhere", () => {
  it("matches documents whose status is published", () => {
    expect(publishedWhere).toEqual({ _status: { equals: "published" } });
  });
});

describe("publishedRead", () => {
  it("grants full read to authenticated requests", () => {
    expect(publishedRead(argsWith({ id: 1 }))).toBe(true);
  });

  it("constrains anonymous reads to published documents", () => {
    expect(publishedRead(argsWith(null))).toEqual(publishedWhere);
  });

  it("treats a missing user as anonymous", () => {
    expect(publishedRead(argsWith(undefined))).toEqual(publishedWhere);
  });
});
