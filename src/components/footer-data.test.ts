import { describe, expect, it, vi } from "vitest";
import type { Payload } from "payload";

// The real config pulls in the database and storage adapters; the unit under
// test only needs getPayload to hand back a controllable payload.
vi.mock("@payload-config", () => ({ default: {} }));
vi.mock("payload", () => ({ getPayload: vi.fn() }));

import { getPayload } from "payload";

import { getFooterGlobal } from "./footer-data";

const findGlobal = vi.fn();

vi.mocked(getPayload).mockResolvedValue({ findGlobal } as unknown as Payload);

describe("getFooterGlobal", () => {
  it("passes the global through when the read succeeds", async () => {
    findGlobal.mockResolvedValue({ id: 1, copyrightName: "Feugee" });

    await expect(getFooterGlobal()).resolves.toEqual({
      id: 1,
      copyrightName: "Feugee",
    });
    expect(findGlobal).toHaveBeenCalledWith({
      slug: "footer",
      depth: 3,
      draft: false,
    });
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
