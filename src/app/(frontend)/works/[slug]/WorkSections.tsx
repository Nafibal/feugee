import type { Work } from "@/payload-types"

import { WorkItemView, type WorkItem } from "./WorkItems"

export type WorkSection = NonNullable<Work["sections"]>[number]
export type WorkLayout = NonNullable<WorkSection["layouts"]>[number]

export const sectionAnchor = (index: number) => `section-${index}`

const layoutClass: Record<WorkLayout["blockType"], string> = {
  "one-column": "grid gap-6",
  "two-column": "grid gap-6 sm:grid-cols-2",
  "three-column": "grid gap-6 sm:grid-cols-3",
  // Item 1 spans both rows on the left; items 2 and 3 stack top and bottom right.
  "feature-left": "grid gap-6 sm:grid-cols-2 sm:grid-rows-2",
}

const itemClass = (layout: WorkLayout, index: number) =>
  layout.blockType === "feature-left" && index === 0 ? "sm:row-span-2" : ""

export const WorkSections = ({ sections }: { sections: Work["sections"] }) => {
  if (!sections?.length) return null

  return (
    <>
      {sections.map((section, sectionIndex) => (
        <section
          key={section.id ?? sectionIndex}
          id={sectionAnchor(sectionIndex)}
          className="scroll-mt-10 space-y-8"
        >
          <h2 className="text-2xl font-semibold text-neutral-950 md:text-3xl">
            {section.title}
          </h2>
          {(section.layouts ?? []).map((layout, layoutIndex) => (
            <div
              key={layout.id ?? layoutIndex}
              className={layoutClass[layout.blockType]}
            >
              {(layout.items ?? []).map((item: WorkItem, itemIndex) => (
                <div key={item.id ?? itemIndex} className={itemClass(layout, itemIndex)}>
                  <WorkItemView item={item} />
                </div>
              ))}
            </div>
          ))}
        </section>
      ))}
    </>
  )
}
