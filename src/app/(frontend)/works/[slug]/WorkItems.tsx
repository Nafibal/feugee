import Image from "next/image";
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
      <Image
        src={asset.url}
        alt={asset.alt}
        className="w-full h-full object-cover"
        width={asset.width ?? 1}
        height={asset.height ?? 1}
      />
    </figure>
  );
};

export const WorkItemView = ({ item }: { item: WorkItem }) => {
  switch (item.blockType) {
    case "title":
      return (
        <div className="p-8">
          <h3 className="text-xl font-semibold text-neutral-50">
            {item.title}
          </h3>
        </div>
      );
    case "titled-text":
      return (
        <div className="space-y-8 p-8">
          {(item.entries ?? []).map((entry, index) => (
            <div key={entry.id ?? index} className="space-y-2">
              <h4 className="text-md text-neutral-600">{entry.title}</h4>
              <RichText data={entry.text} className="text-2xl text-white" />
            </div>
          ))}
        </div>
      );
    case "text":
      return (
        <div className="space-y-8 p-8">
          {(item.entries ?? []).map((entry, index) => (
            // One wrapper per entry keeps each paragraph separately targetable
            // by the animations planned for the real Work Detail Page.
            <div key={entry.id ?? index} className=" text-2xl text-white">
              <RichText data={entry.text} />
            </div>
          ))}
        </div>
      );
    case "asset":
      return <AssetFigure asset={item.asset} />;
  }
};
