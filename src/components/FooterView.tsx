"use client";

import Image from "next/image";
import Link from "next/link";
import { useLivePreview } from "@payloadcms/live-preview-react";
import { useState } from "react";

import type { Footer, Work } from "@/payload-types";

import { ArrowRight } from "./ArrowRight";
import { AutoVideo } from "./AutoVideo";
import { hasFooterCtaContent, toFooterCta } from "./footerCta";
import { LogoMark } from "./LogoMark";
import { toMenuLinks } from "./menu";
import { navigateWithBlackout } from "./page-transition/navigateWithBlackout";
import { SwipeText } from "./SwipeText";
import { toCardWork, type CardWork } from "./work";

interface FooterWorkCard extends CardWork {
  subtitle: string | null;
}

// The card guards (published, populated, usable Thumbnail) live in
// toCardWork; this adds only what the Footer's Other Works cards display.
const toFooterWorkCard = (work: number | Work): FooterWorkCard | null => {
  if (typeof work !== "object") return null;
  const card = toCardWork(work);
  if (card === null) return null;

  return { ...card, subtitle: work.subtitle ?? null };
};

const WorkCard = ({
  item,
  isFirst,
}: {
  item: FooterWorkCard;
  isFirst: boolean;
}) => (
  <Link
    className="block w-full"
    href={`/works/${item.slug}`}
    onNavigate={(event) => navigateWithBlackout(event, `/works/${item.slug}`)}
  >
    <div
      className={`${
        isFirst
          ? "aspect-3/4 md:aspect-square"
          : "aspect-4/3 md:aspect-4/3 lg:aspect-square"
      } w-full overflow-hidden rounded bg-neutral-800`}
    >
      {item.visual.kind === "video" ? (
        <AutoVideo
          alt={item.visual.alt}
          className="h-full w-full object-cover"
          height={item.visual.height}
          poster={item.visual.posterUrl}
          src={item.visual.url}
          width={item.visual.width}
        />
      ) : (
        <Image
          alt={item.visual.alt}
          className="h-full w-full object-cover"
          height={item.visual.height}
          src={item.visual.url}
          width={item.visual.width}
        />
      )}
    </div>
    <div className="mt-3 space-y-1">
      <p className="text-base text-white font-bold">{item.title}</p>
      {item.subtitle && (
        <span className="text-sm text-neutral-500">{item.subtitle}</span>
      )}
    </div>
  </Link>
);

// Brand glyphs from Simple Icons (CC0), sized to match ArrowRight's 16px.
const FacebookIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.267 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
  </svg>
);

const XIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

// Keyed by the platform select's values; the label doubles as the aria-label.
const socialPlatforms = {
  facebook: { label: "Facebook", Icon: FacebookIcon },
  instagram: { label: "Instagram", Icon: InstagramIcon },
  x: { label: "X", Icon: XIcon },
} as const;

// Both column rows stack the same way below md — one class keeps them in step.
const columnRowClassName =
  "w-full flex flex-col-reverse md:flex-col gap-10 items-start lg:flex-row md:justify-between";

// Shared by the Contact CTA's link and fallback-button branches.
const ctaButtonClassName =
  "inline-flex items-center gap-2 text-white px-6 py-3 rounded border-neutral-800 border";

export const FooterView = ({ initialData }: { initialData: Footer }) => {
  // The CMS Dashboard and the site share an origin, so the Live Preview
  // iframe's messages arrive from window.location.origin. Empty during SSR —
  // the hook only reads it inside effects.
  const [serverURL] = useState(() =>
    typeof window === "undefined" ? "" : window.location.origin,
  );
  const { data } = useLivePreview({
    serverURL,
    depth: 3,
    initialData,
  });

  const cta = toFooterCta(data.cta);

  const aboutHeading = data.about?.heading?.trim() || "About";
  const aboutDescription = data.about?.description?.trim() || null;
  const otherWorksHeading = data.otherWorksHeading?.trim() || "Other Works";
  const menuHeading = data.menuHeading?.trim() || "Menu";

  const otherWorks = (data.otherWorks ?? []).flatMap((work) => {
    const card = toFooterWorkCard(work);
    return card ? [card] : [];
  });

  const menuLinks = toMenuLinks(data.menuLinks);

  const contactHeading = data.contact?.heading?.trim() || "Contact Us";
  const callToAction = data.contact?.callToAction?.trim() || null;
  const callToActionUrl = data.contact?.callToActionUrl?.trim() || null;
  const email = data.contact?.email?.trim() || null;
  const phone = data.contact?.phone?.trim() || null;
  const showContact = callToAction !== null || email !== null || phone !== null;

  const copyrightName = data.copyrightName?.trim() || "Feugee";

  const socialLinks = (data.socialLinks ?? []).flatMap((link) => {
    const platform = socialPlatforms[link.platform];
    const url = link.url.trim();
    return platform && url !== "" ? [{ ...link, url, ...platform }] : [];
  });

  return (
    /* The data attribute marks the Page Shift slab (ADR 0007). */
    <footer
      className="mt-auto px-6 pt-6 flex flex-col gap-y-6 items-stretch justify-start bg-linear-to-b from-[#161616] to-neutral-950"
      data-blackout-slab
    >
      {hasFooterCtaContent(cta) && (
        <section
          aria-label="Contact CTA"
          className="flex w-full flex-col items-center justify-center gap-y-8 py-24 text-center md:gap-y-12 md:py-32"
        >
          <div className="flex flex-col gap-y-6 items-center text-center">
            {cta.eyebrow && (
              <p className="text-lg text-neutral-300 md:text-xl">
                {cta.eyebrow}
              </p>
            )}
            {cta.headline && (
              <h2 className="text-4xl text-white font-bold md:text-7xl">
                {cta.headline}
              </h2>
            )}
            {cta.body && (
              <p className="text-lg text-neutral-300 md:text-xl">{cta.body}</p>
            )}
          </div>
          {cta.actionLabel &&
            (cta.actionUrl ? (
              <Link
                className={ctaButtonClassName}
                href={cta.actionUrl}
                onNavigate={(event) => navigateWithBlackout(event, cta.actionUrl!)}
              >
                {cta.actionLabel} <ArrowRight />
              </Link>
            ) : (
              <button className={ctaButtonClassName} type="button">
                {cta.actionLabel} <ArrowRight />
              </button>
            ))}
        </section>
      )}
      <div className="w-full flex flex-col gap-y-12 md:gap-y-16">
        <div className={columnRowClassName}>
          {aboutDescription && (
            <div className="space-y-3 w-full">
              <h2 className="text-base text-neutral-500">{aboutHeading}</h2>
              <p className="text-base text-white w-full md:w-[80%]">
                {aboutDescription}
              </p>
            </div>
          )}
          {otherWorks.length > 0 && (
            <div className="space-y-3 w-full">
              <h2 className="text-base text-neutral-500">
                {otherWorksHeading}
              </h2>
              <div className="w-full flex flex-col gap-y-4 gap-x-1 md:flex-row md:justify-end md:items-start">
                {otherWorks.map((item, index) => (
                  <WorkCard isFirst={index === 0} item={item} key={item.id} />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className={columnRowClassName}>
          {menuLinks.length > 0 && (
            <div className="space-y-4 w-full">
              <h2 className="text-base text-neutral-500">{menuHeading}</h2>
              <ul className="flex flex-col justify-start items-start gap-y-2">
                {menuLinks.map((link) => (
                  <li key={link.id}>
                    <Link
                      className="group text-base text-white"
                      href={link.url}
                      onNavigate={(event) => navigateWithBlackout(event, link.url)}
                    >
                      <SwipeText>{link.label}</SwipeText>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {showContact && (
            <div className="space-y-4 w-full">
              <h2 className="text-base text-neutral-500">{contactHeading}</h2>
              {/* address marks the agency's own contact details; preflight
                  doesn't un-italicize it, so not-italic keeps the look. */}
              <address className="flex flex-col justify-start items-start gap-y-2 not-italic">
                {callToAction &&
                  (callToActionUrl ? (
                    <Link
                      className="text-base text-white"
                      href={callToActionUrl}
                      onNavigate={(event) =>
                        navigateWithBlackout(event, callToActionUrl)
                      }
                    >
                      {callToAction}
                    </Link>
                  ) : (
                    <span className="text-base text-white">{callToAction}</span>
                  ))}
                {email && (
                  <a className="text-base text-white" href={`mailto:${email}`}>
                    {email}
                  </a>
                )}
                {phone && (
                  <a
                    className="text-base text-white"
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                  >
                    {phone}
                  </a>
                )}
              </address>
            </div>
          )}
        </div>
      </div>
      {/* The Wordmark window: the logo artwork stretched edge-to-edge, its
          bottom quarter bleeding past the crop line on md+ (a -mb percentage
          resolves against the container's width, like the logo's own height),
          with the rule and bottom bar layered over its lower letters. Below
          md the letters are too short to spare, so the bar just follows them.
          The window's bottom edge is the footer's bottom edge. */}
      <div className="relative overflow-hidden">
        <div aria-hidden="true" className="w-full text-[#1F1F1F] md:mb-[-3%]">
          <LogoMark className="block h-auto w-full" monochrome />
        </div>
        <div className="relative z-10 pb-6 md:absolute md:inset-x-0 md:bottom-0">
          <div className="mb-6 h-px w-full bg-neutral-700" />
          <div className="w-full flex flex-wrap justify-between items-center gap-x-6 gap-y-3">
            <span className="text-sm text-neutral-500">
              &copy; {new Date().getFullYear()} {copyrightName}. All Rights
              Reserved.
            </span>
            {data.location && (
              <div className="text-sm text-neutral-500 flex items-center justify-start gap-x-3">
                <span>{data.location}</span>
              </div>
            )}
            {socialLinks.length > 0 && (
              <div className="flex justify-end items-center gap-x-3">
                {socialLinks.map(({ id, url, label, Icon }) => (
                  <a
                    aria-label={label}
                    className="border border-neutral-700 rounded p-2 text-neutral-500 transition-colors hover:text-white"
                    href={url}
                    key={id}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
