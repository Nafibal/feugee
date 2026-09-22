"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import { useState } from "react";

import type { Work } from "@/payload-types";

import { WorkDetail } from "./WorkDetail";

// The CMS Dashboard and this page share an origin, so the Live Preview
// iframe's messages arrive from window.location.origin. Empty during SSR —
// the hook only reads it inside effects.
export const WorkDetailLivePreview = ({ initialData }: { initialData: Work }) => {
  const [serverURL] = useState(() =>
    typeof window === "undefined" ? "" : window.location.origin,
  );
  const { data } = useLivePreview({
    serverURL,
    depth: 2,
    initialData,
  });

  return <WorkDetail data={data} />;
};
