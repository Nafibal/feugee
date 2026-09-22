import configPromise from "@payload-config";
import type { Metadata } from "next";
import { cache } from "react";
import { getPayload } from "payload";

import type { Client } from "@/payload-types";

import type { MarqueeClient } from "@/components/ClientMarquee";
import { sizedUrlOf } from "@/components/work";
import { heroOgImage } from "@/seo/ogImage";
import { pageMetadata } from "@/seo/metadata";
import { LandingPageView } from "./LandingPageView";

// The page reads the database on every request, so request-time rendering is
// the honest mode (same as the Works Page).
export const dynamic = "force-dynamic";

// A Client without a populated logo can't ride the marquee — drop it. Fallback
// dimensions cover logo formats Payload doesn't measure (SVG); the marquee
// fixes the height and lets the width follow. Raster logos request the
// thumbnail variant — the marquee renders them ~40px tall.
const toMarqueeClient = (client: Client): MarqueeClient | null => {
  if (
    typeof client.logo !== "object" ||
    client.logo === null ||
    typeof client.logo.url !== "string"
  ) {
    return null;
  }

  return {
    id: client.id,
    name: client.name,
    url: client.url ?? null,
    logo: {
      url: sizedUrlOf(client.logo, "thumbnail") ?? client.logo.url,
      alt: client.logo.alt,
      width: client.logo.width ?? 120,
      height: client.logo.height ?? 40,
    },
  };
};

const getLandingPageData = cache(async () => {
  const payload = await getPayload({ config: configPromise });
  // Depth 3 populates the Selected Works, their Feature Visuals/Thumbnails
  // and, in turn, the posters. Clients is orderable — its default `_order`
  // sort is the drag order set in the CMS Dashboard.
  const [landingPage, clientsResult] = await Promise.all([
    payload.findGlobal({
      slug: "landing-page",
      depth: 3,
      draft: false,
    }),
    payload.find({
      collection: "clients",
      depth: 1,
      draft: false,
      limit: 0,
    }),
  ]);

  const clients = clientsResult.docs
    .map(toMarqueeClient)
    .filter((client): client is MarqueeClient => client !== null);

  return { landingPage, clients };
});

export default async function Page() {
  const { landingPage, clients } = await getLandingPageData();

  return <LandingPageView clients={clients} initialData={landingPage} />;
}

export const generateMetadata = async (): Promise<Metadata> => {
  const { landingPage } = await getLandingPageData();

  const heroTitle = landingPage.hero?.title?.trim();

  return pageMetadata({
    title: heroTitle ? `Feugee — ${heroTitle}` : "Feugee",
    description: landingPage.hero?.subtitle,
    url: "/",
    image: heroOgImage(landingPage.hero),
  });
};
