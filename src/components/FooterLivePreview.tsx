"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";

import type { Footer } from "@/payload-types";

import { FooterContent } from "./FooterView";

// Mounted only after the client-side gate saw ?livePreview=footer, so window
// exists by construction and the origin is the one the CMS Dashboard's
// messages arrive from. Default export: lazy() loads it.
export default function FooterLivePreview({
  initialData,
}: {
  initialData: Footer;
}) {
  const { data } = useLivePreview({
    serverURL: window.location.origin,
    depth: 3,
    initialData,
  });

  return <FooterContent data={data} />;
}
