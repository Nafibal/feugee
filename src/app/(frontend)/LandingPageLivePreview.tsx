"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";

import type { LandingPage } from "@/payload-types";

import type { MarqueeClient } from "@/components/ClientMarquee";
import { LandingPageContent } from "./LandingPageView";

// Mounted only after the client-side gate saw ?livePreview=landing-page, so
// window exists by construction and the origin is the one the CMS
// Dashboard's messages arrive from. Default export: lazy() loads it.
export default function LandingPageLivePreview({
  clients,
  initialData,
}: {
  clients: MarqueeClient[];
  initialData: LandingPage;
}) {
  const { data } = useLivePreview({
    serverURL: window.location.origin,
    depth: 3,
    initialData,
  });

  return <LandingPageContent clients={clients} data={data} />;
}
