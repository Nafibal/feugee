import configPromise from "@payload-config";
import Image from "next/image";
import Link from "next/link";
import { getPayload } from "payload";

import type { Work } from "@/payload-types";

import { AutoVideo } from "./AutoVideo";
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

const WorkCard = ({ item }: { item: FooterWorkCard }) => (
  <Link className="block w-full" href={`/works/${item.slug}`}>
    <div className="aspect-square w-full overflow-hidden rounded bg-neutral-800">
      {item.thumbnail.kind === "video" ? (
        <AutoVideo
          alt={item.thumbnail.alt}
          className="h-full w-full object-cover"
          height={item.thumbnail.height}
          poster={item.thumbnail.posterUrl}
          src={item.thumbnail.url}
          width={item.thumbnail.width}
        />
      ) : (
        <Image
          alt={item.thumbnail.alt}
          className="h-full w-full object-cover"
          height={item.thumbnail.height}
          src={item.thumbnail.url}
          width={item.thumbnail.width}
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
  <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
  </svg>
);

const XIcon = () => (
  <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

// Keyed by the platform select's values; the label doubles as the aria-label.
const socialPlatforms = {
  facebook: { label: "Facebook", Icon: FacebookIcon },
  instagram: { label: "Instagram", Icon: InstagramIcon },
  x: { label: "X", Icon: XIcon },
} as const;

// Mounted once in the frontend root layout, so every public page shares it.
// mt-auto pins it to the viewport bottom on pages shorter than 100vh — the
// body is a flex column and this is its last child.
export const Footer = async () => {
  const payload = await getPayload({ config: configPromise });
  // Depth 3 populates the Other Works, their Thumbnails and, in turn, the
  // posters — same requirement as the Landing Page's Selected Works.
  const footer = await payload.findGlobal({
    slug: "footer",
    depth: 3,
    draft: false,
  });

  const aboutHeading = footer.about?.heading?.trim() || "About";
  const aboutDescription = footer.about?.description?.trim() || null;
  const otherWorksHeading = footer.otherWorksHeading?.trim() || "Other Works";
  const menuHeading = footer.menuHeading?.trim() || "Menu";

  const otherWorks = (footer.otherWorks ?? []).flatMap((work) => {
    const card = toFooterWorkCard(work);
    return card ? [card] : [];
  });

  const menuLinks = (footer.menuLinks ?? []).filter(
    (link) => link.label.trim() !== "" && link.url.trim() !== "",
  );

  const contactHeading = footer.contact?.heading?.trim() || "Contact Us";
  const callToAction = footer.contact?.callToAction?.trim() || null;
  const callToActionUrl = footer.contact?.callToActionUrl?.trim() || null;
  const email = footer.contact?.email?.trim() || null;
  const phone = footer.contact?.phone?.trim() || null;
  const showContact =
    callToAction !== null || email !== null || phone !== null;

  const wordmark = footer.wordmark?.trim() || "FEUGEE STUDIO";
  const copyrightName = footer.copyrightName?.trim() || "Feugee";

  const socialLinks = (footer.socialLinks ?? []).flatMap((link) => {
    const platform = socialPlatforms[link.platform];
    const url = link.url.trim();
    return platform && url !== "" ? [{ ...link, url, ...platform }] : [];
  });

  return (
    <footer className="mt-auto p-6 flex flex-col gap-y-6 items-stretch justify-start">
      <div className="w-full flex flex-col gap-y-16">
        <div className="w-full flex gap-10 justify-between items-start">
          {aboutDescription && (
            <div className="space-y-3 w-full">
              <h2 className="text-base text-neutral-500">{aboutHeading}</h2>
              <p className="text-base text-white w-[80%]">{aboutDescription}</p>
            </div>
          )}
          {otherWorks.length > 0 && (
            <div className="space-y-3 w-full">
              <h2 className="text-base text-neutral-500">{otherWorksHeading}</h2>
              <div className="w-full flex gap-x-1 justify-end items-start">
                {otherWorks.map((item) => (
                  <WorkCard item={item} key={item.id} />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="w-full flex gap-10 justify-between items-start">
          {menuLinks.length > 0 && (
            <div className="space-y-4 w-full">
              <h2 className="text-base text-neutral-500">{menuHeading}</h2>
              <ul className="flex flex-col justify-start items-start gap-y-2">
                {menuLinks.map((link) => (
                  <li key={link.id}>
                    <Link className="text-base text-white" href={link.url}>
                      {link.label}
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
                    <Link className="text-base text-white" href={callToActionUrl}>
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
      <div className="@container w-full">
        {/* Display wordmark, not a heading — keep it out of the outline. */}
        <div className="w-full whitespace-nowrap text-[12.8cqw] font-bold leading-none text-white">
          {wordmark}
        </div>
      </div>
      <div className="w-full h-px bg-neutral-700"></div>
      <div className="w-full flex justify-between items-center">
        <span className="text-sm text-neutral-500">
          &copy; {new Date().getFullYear()} {copyrightName}. All Rights
          Reserved.
        </span>
        {footer.location && (
          <div className="text-sm text-neutral-500 flex items-center justify-start gap-x-3">
            {/* Pin Icon */}
            <span>{footer.location}</span>
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
    </footer>
  );
};
