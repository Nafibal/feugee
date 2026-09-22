import type { Metadata } from "next";

import type { OgImage } from "./ogImage";

type PageMetadataInput = {
  /** The final, already-suffixed page title ("Fest for Music — Feugee"). */
  title: string;
  description?: string | null;
  /** The page's own path ("/works"); `metadataBase` makes it absolute. */
  url?: string;
  image?: OgImage | null;
};

/**
 * The one shareable shape of a public page's crawler face: title and
 * description as plain + OG + Twitter tags, canonical + og:url from the page
 * path, and the OG image with its dimensions when there is one. Every public
 * page builds its Metadata through here so the tag set stays uniform —
 * segments that set `openGraph` replace the parent's wholesale, so partial
 * inheritance is not an option.
 */
export const pageMetadata = ({
  title,
  description: rawDescription,
  url,
  image,
}: PageMetadataInput): Metadata => {
  const description = rawDescription?.trim() || undefined;

  return {
    title,
    description,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      title,
      description,
      url,
      siteName: "Feugee",
      type: "website",
      ...(image ? { images: [image] } : {}),
    },
    twitter: {
      // summary_large_image needs an image to be worth anything.
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image.url] } : {}),
    },
  };
};
