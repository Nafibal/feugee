# Landing Page as a fixed-section singleton global

The Landing Page's section composition is fixed by the Agency's design (Hero, Who We Are, Stats, Client Marquee, Selected Works). We model it as one Payload global with a named field group per section, rather than the more common Payload pattern of a flexible block-builder, and the Client Marquee's logos live in their own orderable Clients collection read directly by the page rather than in an array on the global.

## Considered Options

- **Block-builder collection** (a pages collection with flexible blocks) — the default Payload answer for page content; rejected because section composition here is a design decision, not an editorial one. Blocks would let the Agency delete or reorder sections the layout depends on, and add versioning weight to a page that will only ever exist once.
- **Multiple small globals** (Hero, About, Clients…) — one publish per section; rejected because a half-edited homepage (one Stat changed, its sibling not) could go live mid-edit. One global gives one draft/publish flow and one live-preview target.
- **Fixed-section singleton global** (chosen) — the composition lives in code; the Agency edits content per section. Trade-offs: adding a section is a config change plus migration, and this shape serves exactly one page — a second marketing page would need a different pattern.
- **Logos as an array on the global vs. a Clients collection** (chosen: collection) — clients are durable entities independent of any one page's layout; a collection is reusable (e.g. a future relationship from Work → Client), independently orderable, and keeps the global free of long lists.

## Consequences

- Adding a section to the Landing Page is additive (a new group on the global + migration); removing or renaming one requires migrating stored data.
- Hero slides are an array of one-field rows rather than a bare hasMany upload, so per-slide fields (e.g. a Work link) can be added later without reshaping stored data.
- Selected Works offers only published Works (`filterOptions` on `_status`); a Work unpublished later stays referenced and the page build must decide how to render the gap.
- Works.client remains free text; converting it to a Clients relationship is deferred until double-entry actually hurts (see `CONTEXT.md` — Client).
