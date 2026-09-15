import configPromise from "@payload-config";
import Image from "next/image";
import Link from "next/link";
import { getPayload } from "payload";

import type { Work } from "@/payload-types";

import { AutoVideo } from "./AutoVideo";
import { workThumbnailOf, type WorkThumbnail } from "./videoAsset";

interface FooterWorkCard {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  thumbnail: WorkThumbnail;
}

// Same shape-guarding as the landing page's Selected Works: unpublished or
// thumbnail-less Works drop out rather than rendering a dead card.
const toFooterWorkCard = (work: Work): FooterWorkCard | null => {
  if (work._status !== "published") return null;
  const thumbnail = workThumbnailOf(work);
  if (thumbnail === null) return null;

  return {
    id: work.id,
    slug: work.slug ?? "",
    title: work.title,
    subtitle: work.subtitle ?? null,
    thumbnail,
  };
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
    if (typeof work !== "object" || work === null) return [];
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

  return (
    <footer className="mt-auto p-6 flex flex-col gap-y-6 items-stretch justify-start">
      <div className="w-full flex flex-col gap-y-16">
        <div className="w-full flex gap-10 justify-between items-start">
          {aboutDescription && (
            <div className="space-y-3 w-full">
              <h4 className="text-base text-neutral-500">{aboutHeading}</h4>
              <p className="text-base text-white w-[80%]">{aboutDescription}</p>
            </div>
          )}
          {otherWorks.length > 0 && (
            <div className="space-y-3 w-full">
              <h4 className="text-base text-neutral-500">{otherWorksHeading}</h4>
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
              <h4 className="text-base text-neutral-500">{menuHeading}</h4>
              <div className="flex flex-col justify-start items-start gap-y-2">
                {menuLinks.map((link) => (
                  <Link
                    className="text-base text-white"
                    href={link.url}
                    key={link.id}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {showContact && (
            <div className="space-y-4 w-full">
              <h4 className="text-base text-neutral-500">{contactHeading}</h4>
              <div className="flex flex-col justify-start items-start gap-y-2">
                {callToAction &&
                  (callToActionUrl ? (
                    <Link className="text-base text-white" href={callToActionUrl}>
                      {callToAction}
                    </Link>
                  ) : (
                    <span className="text-base text-white">{callToAction}</span>
                  ))}
                {email && <span className="text-base text-white">{email}</span>}
                {phone && <span className="text-base text-white">{phone}</span>}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="@container w-full">
        <h2 className="w-full whitespace-nowrap text-[12.8cqw] font-bold leading-none text-white">
          {wordmark}
        </h2>
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
        <div className="flex justify-end items-center gap-x-3">
          {/* TODO: Add social media links */}
          <div className="border border-neutral-700 rounded">
            {/* Facebook Icon */}
          </div>
          <div className="border border-neutral-700 rounded">
            {/* Instagram Icon */}
          </div>
          <div className="border border-neutral-700 rounded">{/* X Icon */}</div>
        </div>
      </div>
    </footer>
  );
};
