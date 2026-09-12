import type { Work } from "@/payload-types";

import { WorkItemView, type WorkItem } from "./WorkItems";

export type WorkSection = NonNullable<Work["sections"]>[number];
export type WorkLayout = NonNullable<WorkSection["layouts"]>[number];

export const sectionAnchor = (index: number) => `section-${index}`;

const layoutClass: Record<WorkLayout["blockType"], string> = {
  "one-column": "grid gap-[4px]",
  "two-column": "grid gap-[4px] sm:grid-cols-2",
  "three-column": "grid gap-[4px] sm:grid-cols-3",
  // Item 1 spans both rows on the left; items 2 and 3 stack top and bottom right.
  "feature-left": "grid gap-[4px] sm:grid-cols-2 sm:grid-rows-2",
  // Item 1 spans both rows on the right; items 2 and 3 stack top and bottom left.
  "feature-right": "grid gap-[4px] sm:grid-cols-2 sm:grid-rows-2",
};

const itemClass = (layout: WorkLayout, index: number) => {
  if (layout.blockType === "feature-left") {
    return index === 0 ? "sm:row-span-2" : "";
  }
  if (layout.blockType === "feature-right") {
    if (index === 0) return "sm:col-start-2 sm:row-span-2";
    return index === 1
      ? "sm:col-start-1 sm:row-start-1"
      : "sm:col-start-1 sm:row-start-2";
  }
  return "";
};

export const WorkSections = ({ sections }: { sections: Work["sections"] }) => {
  if (!sections?.length) return null;

  return (
    <div className="w-full space-y-1 pb-8">
      {sections.map((section, sectionIndex) => (
        <section
          key={section.id ?? sectionIndex}
          id={sectionAnchor(sectionIndex)}
          className="scroll-mt-10 space-y-1"
        >
          {(section.layouts ?? []).map((layout, layoutIndex) => (
            <div
              key={layout.id ?? layoutIndex}
              className={layoutClass[layout.blockType]}
            >
              {(layout.items ?? []).map((item: WorkItem, itemIndex) => (
                <div
                  key={item.id ?? itemIndex}
                  className={itemClass(layout, itemIndex)}
                >
                  <WorkItemView item={item} />
                </div>
              ))}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
};
