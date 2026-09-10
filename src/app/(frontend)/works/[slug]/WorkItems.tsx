import { RichText } from "@payloadcms/richtext-lexical/react"

import type { Asset } from "@/payload-types"

import type { WorkLayout } from "./WorkSections"

export type WorkItem = NonNullable<NonNullable<WorkLayout["items"]>[number]>

const AssetFigure = ({ asset }: { asset: number | Asset }) => {
  // A bare number means the relationship was never populated — only reachable
  // through live-preview edge cases, never through the page's own query.
  if (typeof asset === "number") {
    return <p className="text-sm text-neutral-400">Unresolved Asset #{asset}</p>
  }

  return (
    <figure className="space-y-2">
      {asset.mimeType?.startsWith("video/") ? (
        <video controls src={asset.url ?? undefined} className="w-full rounded-lg" />
      ) : (
        asset.url && <img src={asset.url} alt={asset.alt} className="w-full rounded-lg" />
      )}
      {asset.caption && <figcaption className="text-sm text-neutral-500">{asset.caption}</figcaption>}
    </figure>
  )
}

export const WorkItemView = ({ item }: { item: WorkItem }) => {
  switch (item.blockType) {
    case "title":
      return <h3 className="text-xl font-semibold text-neutral-950">{item.title}</h3>
    case "titled-text":
      return (
        <div className="space-y-5">
          {(item.entries ?? []).map((entry, index) => (
            <div key={entry.id ?? index} className="space-y-2">
              <h4 className="font-medium text-neutral-950">{entry.title}</h4>
              <RichText data={entry.text} className="text-neutral-700" />
            </div>
          ))}
        </div>
      )
    case "text":
      return (
        <div className="space-y-5">
          {(item.entries ?? []).map((entry, index) => (
            // One wrapper per entry keeps each paragraph separately targetable
            // by the animations planned for the real Work Detail Page.
            <div key={entry.id ?? index} className="text-neutral-700">
              <RichText data={entry.text} />
            </div>
          ))}
        </div>
      )
    case "asset":
      return <AssetFigure asset={item.asset} />
  }
}
