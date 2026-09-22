import { describe, expect, it } from "vitest";

import {
  assetUploadLimitBytes,
  describeSize,
  uploadSizeError,
} from "./assetUploadCap";

const MEGABYTE = 1024 * 1024;

describe("assetUploadLimitBytes", () => {
  it("is a deliberate, round guard — 100 MB", () => {
    expect(assetUploadLimitBytes).toBe(100 * MEGABYTE);
  });
});

describe("uploadSizeError", () => {
  it("passes files with no size — nothing was uploaded", () => {
    expect(uploadSizeError(undefined)).toBeNull();
  });

  it("passes a file exactly at the cap", () => {
    expect(uploadSizeError(assetUploadLimitBytes)).toBeNull();
  });

  it("rejects a file one byte over with a friendly message", () => {
    const error = uploadSizeError(assetUploadLimitBytes + 1);

    expect(error).not.toBeNull();
    expect(error?.data.errors).toHaveLength(1);
    const message = error?.data.errors[0]?.message ?? "";
    expect(message).toContain("100 MB");
    expect(message).toMatch(/larger than|bigger than|exceeds|is\s/i);
  });

  it("names the offending file's size in the message", () => {
    const error = uploadSizeError(1.5 * 1024 * MEGABYTE);

    const message = error?.data.errors[0]?.message ?? "";
    expect(message).toContain("1.5 GB");
  });
});

describe("describeSize", () => {
  it("reads whole megabytes without decimals", () => {
    expect(describeSize(100 * MEGABYTE)).toBe("100 MB");
  });

  it("keeps one decimal below a gigabyte", () => {
    expect(describeSize(2.5 * MEGABYTE)).toBe("2.5 MB");
  });

  it("switches to gigabytes past 1024 MB", () => {
    expect(describeSize(1.5 * 1024 * MEGABYTE)).toBe("1.5 GB");
  });
});
