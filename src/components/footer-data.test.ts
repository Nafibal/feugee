import { describe, expect, it, vi } from "vitest";
import type { Payload } from "payload";

// The real config pulls in the database and storage adapters; the unit under
// test only needs getPayload to hand back a controllable payload.
vi.mock("@payload-config", () => ({ default: {} }));
vi.mock("payload", () => ({ getPayload: vi.fn() }));

import { getPayload } from "payload";

import { getFooterGlobal } from "./footer-data";

const findGlobal = vi.fn();
const find = vi.fn();

vi.mocked(getPayload).mockResolvedValue({
  findGlobal,
  find,
} as unknown as Payload);

describe("getFooterGlobal", () => {
  it("reads the global at depth 0 — Other Works rehydrate separately", async () => {
    findGlobal.mockResolvedValue({ id: 1, copyrightName: "Feugee" });

    await expect(getFooterGlobal()).resolves.toEqual({
      id: 1,
      copyrightName: "Feugee",
    });
    expect(findGlobal).toHaveBeenCalledWith({
      slug: "footer",
      depth: 0,
      draft: false,
    });
    expect(find).not.toHaveBeenCalled();
  });

  it("rehydrates Other Works through a card-select find, in CMS order", async () => {
    findGlobal.mockResolvedValue({ id: 1, otherWorks: [7, 3, 9] });
    find.mockResolvedValue({
      docs: [
        { id: 3, title: "Pulse Festival Identity" },
        { id: 9, title: "Solstice Denim Rebrand" },
      ],
    });

    await expect(getFooterGlobal()).resolves.toMatchObject({
      otherWorks: [7, { id: 3 }, { id: 9 }],
    });
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: "works",
        depth: 2,
        draft: false,
        where: {
          and: [
            { id: { in: [7, 3, 9] } },
            { _status: { equals: "published" } },
          ],
        },
      }),
    );

    // The find is trimmed to the card fields — no detail-page Sections.
    const { select } = find.mock.calls[0][0];
    expect(select.sections).toBeUndefined();
    expect(select.testimonials).toBeUndefined();
  });

  it("resolves null instead of throwing when the read fails", async () => {
    findGlobal.mockRejectedValue(new Error("Connection terminated"));

    await expect(getFooterGlobal()).resolves.toBeNull();
  });

  it("logs the failure so it stays visible in server logs", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    findGlobal.mockRejectedValue(new Error("Connection terminated"));

    await getFooterGlobal();

    expect(errorSpy).toHaveBeenCalledOnce();
    errorSpy.mockRestore();
  });
});
