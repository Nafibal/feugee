import { describe, expect, it } from "vitest";

import { previewRequested } from "./previewRequested";

describe("previewRequested", () => {
  it("matches the surface the preview is for", () => {
    expect(previewRequested("?livePreview=landing-page", "landing-page")).toBe(
      true,
    );
  });

  it("rejects a different surface's preview", () => {
    // The Landing Page and the Footer both render on "/" — only the surface
    // being edited may mount its Live Preview machinery.
    expect(previewRequested("?livePreview=footer", "landing-page")).toBe(false);
  });

  it("rejects a plain visit with no preview flag", () => {
    expect(previewRequested("", "footer")).toBe(false);
    expect(previewRequested("?sector=fashion", "footer")).toBe(false);
  });

  it("reads the flag among other query parameters", () => {
    expect(previewRequested("?a=1&livePreview=works&b=2", "works")).toBe(true);
  });

  it("matches the surface exactly, not as a prefix", () => {
    expect(previewRequested("?livePreview=works-archive", "works")).toBe(false);
  });
});
