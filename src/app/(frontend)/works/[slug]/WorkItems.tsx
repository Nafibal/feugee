import { RichText } from "@payloadcms/richtext-lexical/react";

import type { Asset } from "@/payload-types";

import type { WorkLayout } from "./WorkSections";

export type WorkItem = NonNullable<NonNullable<WorkLayout["items"]>[number]>;

const AssetFigure = ({ asset }: { asset: number | Asset }) => {
  // Demo scope: images only. The relationship can be empty or unpopulated
  // while a Live Preview edit is mid-flight — render nothing rather than crash.
  if (typeof asset !== "object" || asset === null || !asset.url) {
    return null;
  }

  return (
    <figure className="h-full w-full">
      <img
        src={asset.url}
        alt={asset.alt}
        className="w-full rounded-lg h-full object-cover"
      />
      {/* {asset.caption && (
        <figcaption className="text-sm text-neutral-500">
          {asset.caption}
        </figcaption>
      )} */}
    </figure>
  );
};

export const WorkItemView = ({ item }: { item: WorkItem }) => {
  switch (item.blockType) {
    case "title":
      return (
        <h3 className="text-xl font-semibold text-neutral-50">{item.title}</h3>
      );
    case "titled-text":
      return (
        <div className="space-y-5">
          {(item.entries ?? []).map((entry, index) => (
            <div key={entry.id ?? index} className="space-y-2">
              <h4 className="font-medium text-neutral-50">{entry.title}</h4>
              <RichText data={entry.text} className="text-neutral-300" />
            </div>
          ))}
        </div>
      );
    case "text":
      return (
        <div className="space-y-5">
          {(item.entries ?? []).map((entry, index) => (
            // One wrapper per entry keeps each paragraph separately targetable
            // by the animations planned for the real Work Detail Page.
            <div key={entry.id ?? index} className="text-neutral-300">
              <RichText data={entry.text} />
            </div>
          ))}
        </div>
      );
    case "asset":
      return <AssetFigure asset={item.asset} />;
  }
};
