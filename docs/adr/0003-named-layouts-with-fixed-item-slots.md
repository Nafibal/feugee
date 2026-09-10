# Named Layouts with fixed Item slots

Work Detail Pages present content in curated grids — from plain multi-column rows to asymmetric arrangements where one Item spans two rows. The obvious model — a column count per Layout, with Items flowing into it — cannot express asymmetric arrangements. Each Layout is therefore a named type from a fixed vocabulary (e.g. "Feature left": item 1 spans two rows on the left, items 2–3 stack on the right) that fixes both its item count and its geometry; the item count is enforced at save time so a partially filled Layout cannot be published. The vocabulary is expected to evolve with the Agency's design decisions.

## Consequences

- Adding a new Layout type is additive; changing or removing one already used by Works requires migrating stored documents.
- Items are positional — their order within a Layout determines which grid slot they occupy.
- The vocabulary's final specifications are pending the Agency; the initial set (one-column, two-column, three-column, feature-left) is provisional.
