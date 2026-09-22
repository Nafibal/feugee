"use client";

import { useSyncExternalStore } from "react";

import { previewRequested } from "./previewRequested";

// The URL is an external store: popstate covers history traversal, and the
// server snapshot settles the flag before hydration — false during SSR and
// the first client render, so the server HTML matches and anonymous
// visitors never mount the Live Preview machinery.
const subscribeToLocation = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};

/**
 * Whether this surface's Live Preview is armed — the CMS Dashboard's preview
 * iframe loads the page with `?livePreview=<surface>`.
 */
export const usePreviewRequested = (surface: string): boolean =>
  useSyncExternalStore(
    subscribeToLocation,
    () => previewRequested(window.location.search, surface),
    () => false,
  );
