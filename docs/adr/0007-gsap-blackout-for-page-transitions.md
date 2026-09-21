# GSAP Blackout overlay for page transitions

The public site's page transitions are a sequenced gesture — the Blackout fully covers the page *before* the route swaps, holds covered until the next page is ready (capped), then reveals — with the live outgoing page shifting as it's covered. Next.js 16 ships React's `<ViewTransition>` (browser View Transitions API), which would be the obvious tool, but its model animates snapshots around the navigation itself: forcing our cover-first sequencing, the ready-hold with a timeout cap, and a lagging shift of the live DOM would mean fighting `::view-transition-*` pseudo-element animations, with silent cross-browser degradation where the API is missing. We instead drive the Blackout with GSAP: a fixed overlay animated by explicit timelines, link clicks intercepted via Next's `Link onNavigate` (`preventDefault()`, play cover, then `router.push()`), and the reveal gated on the pathname change that signals the new page committed. GSAP is already the site's animation language, and ADR 0004 reserved the Lenis `stop()`/`scrollTo(0, { immediate: true })` hooks for exactly this.

## Consequences

- Every internal `<Link>` on the public site must pass the shared `onNavigate` handler (~6 call sites today); a future link that forgets it navigates without the transition. `onNavigate`'s built-in filtering keeps modifier-clicks, external URLs, and downloads behaving natively.
- Browser back/forward can't be cancelled (`popstate` fires before we can cover), so history navigations accept a race between the Blackout's slide-in and the new page's render; verified acceptable in testing, with a faster snap-in as the fallback if the flash is observable.
- Query-only changes (the Works Page sector filter) are exempt: they update the page in place, without the Blackout.
- Revisit `<ViewTransition>` if the spec ever simplifies to crossfade-class transitions — this decision is about the sequenced state machine, not a permanent attachment to overlays.
