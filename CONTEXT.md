# Feugee

The public website and content management system for Feugee, a creative agency. Built for the agency by a contracted developer; content shape is defined by the agency over time.

## Language

### Public site

The visitor-facing part of the website. Animation-heavy (scroll and page transitions).

**Landing Page**:
The site's front page a visitor lands on first.
_Avoid_: Home, homepage

**Hero**:
The opening, full-screen section of the Landing Page: a slider of autoplaying video Assets that stays visually still while the page scrolls over it, the title stacked in its bottom-left, and a Scroll Cue in its bottom-right.
_Avoid_: Banner, header, carousel

**Slide**:
A single video Asset in the Hero's slider, shown full-screen one at a time.
_Avoid_: Frame, panel

**Rotating Word**:
The changing final word of the Hero title — one of the agency-managed words that cycles in place above the slide dashes.
_Avoid_: Cycling word, animated word, swap word

**Scroll Cue**:
The "| Scroll to explore" text in the Hero's bottom-right signaling more content below.
_Avoid_: Scroll hint, scroll indicator, scroll arrow

**Client Marquee**:
The strip of Client logos on the Landing Page that auto-scrolls horizontally without end.
_Avoid_: Logo wall, partners, trusted-by

**Selected Works**:
The Works the Agency curates to feature on the Landing Page, in display order.
_Avoid_: Featured works, highlights

**Pinned Caption**:
The title and year of the Work currently occupying the bottom of the screen in the Selected Works section — held in one spot while Works scroll past, shown only while its Work is on screen.
_Avoid_: Sticky caption, floating caption, work overlay

**Works Rail**:
The vertical strip of Work titles along the right edge of the Selected Works section, with an arrow marking the Work currently occupying the bottom of the screen — the same Work the Pinned Caption names. An indicator only: nothing in it is clickable.
_Avoid_: Side nav, works nav, dot nav, work indicator

**Testimonials**:
The Landing Page section below Selected Works that presents Agency Testimonials in two columns drifting in opposite directions.
_Avoid_: Reviews, quotes wall, testimonials section

**Works Page**:
The public page listing every published Work.
_Avoid_: Portfolio page, projects page

**Work Detail Page**:
The public page presenting one Work in depth.
_Avoid_: Case study page, project page

**Work**:
A single portfolio piece the agency presents publicly. Richly detailed — not a simple record. Presented as a sequence of Sections; its core field shape is defined.
_Avoid_: Project, portfolio item, case study

**Thumbnail**:
The primary visual representing a Work, shown at the top of the Work Detail Page and as its card on the Works Page. An Asset — image or video. A video Thumbnail plays muted, looping, and without controls, like every video on the public site.
_Avoid_: Cover, hero image, featured image

**Section**:
A titled group of content within a Work. Each Section is one destination in the Work Detail Page's sidebar navigation.
_Avoid_: Chapter, part, block

**Layout**:
A named arrangement from a fixed vocabulary that positions Items on a grid. Each Layout determines how many Items it holds and where each one sits.
_Avoid_: Grid, row, layout type

**Item**:
A single content cell within a Layout — a standalone title, a set of paragraphs (titled or plain), or an Asset.
_Avoid_: Cell, block, element

**Scroll Progress Bar**:
A thin fixed bar at the top of a public page that fills left to right as the visitor scrolls through the page's main content.
_Avoid_: Progress indicator, reading bar, scroll tracker

**Navbar**:
The strip at the top of every public page: the logo and the Menu control.
_Avoid_: Header, top bar, navigation bar

**Menu**:
The public site's primary navigation, opened as a dropdown from the Navbar on every viewport. Its links are the Footer's menu links — managed once in the CMS.
_Avoid_: Nav, hamburger, overlay menu, navigation drawer

**Footer**:
The strip at the bottom of every public page: an About blurb, Other Works cards, menu links, contact details, and the display wordmark above the bottom bar. Its content is a global in the CMS, separate from the Landing Page.
_Avoid_: Bottom bar, site footer, footer section

**Other Works**:
The Works shown as cards in the Footer, in display order. Distinct from the Landing Page's Selected Works.
_Avoid_: Other projects, featured works

**Social Link**:
A social media profile linked from the Footer's bottom bar — a platform (which picks the icon) and its URL.
_Avoid_: Social icon, social media button

### CMS

The authenticated area where the agency manages public site content.

**CMS Dashboard**:
The admin area where the agency manages the content of the public pages.
_Avoid_: Admin panel, back office

**Agency**:
Feugee itself — the owner of the site and its content. Distinguished from a site visitor or the developer.
_Avoid_: Client, owner, user

**Client**:
The external company a Work was made for. Distinct from the Agency and from a site visitor.
_Avoid_: Customer, brand, partner

**Asset**:
An uploaded image or video file managed by the CMS and referenced by site content.
_Avoid_: Media, file, upload

**Poster**:
The image Asset standing in for a video Asset before it plays. Serves as the preview frame and — because Payload measures no dimensions for videos — as the video's aspect ratio in the Works masonry and Layouts.
_Avoid_: Still frame, preview image, thumbnail frame

**Draft**:
A Work visible only inside the CMS Dashboard, not yet shown on the public site.
_Avoid_: Unpublished, pending

**Published**:
A Work visible on the public site. Only the Agency can publish.
_Avoid_: Live, released

**Sector**:
The industry a Work was created for; the facet the Works Page filters Works by.
_Avoid_: Category, industry, vertical

**Tag**:
A short free-form label attached to a Work and displayed as a chip.
_Avoid_: Tag chip, label, keyword

**Year**:
The year a Work was produced or released.
_Avoid_: Date, date completed

**Duration**:
How long a Work took to produce, in the Agency's own words — e.g. "6 weeks". Not a film runtime.
_Avoid_: Runtime, length, timeframe

**Associate**:
The project lead responsible for a Work.
_Avoid_: Partner, collaborator

**Project Team**:
The Agency's own staff credited on a Work.
_Avoid_: Team members, staff list

**Collaborator**:
A person outside the Agency credited on a Work.
_Avoid_: Contributor, partner

**Expertise**:
The creative disciplines the Agency applied to a Work.
_Avoid_: Skills, services

**Testimonial**:
A quoted endorsement of a Work, attributed to a named person and their company. Distinct from the Agency Testimonial.
_Avoid_: Quote, review

**Agency Testimonial**:
A quoted endorsement of the Agency itself — not tied to any one Work — attributed to a named person, their job, and their company.
_Avoid_: Quote, review, landing testimonial

**Stat**:
A proof figure on the Landing Page, as a value with a label — e.g. "55+" with "Videos".
_Avoid_: Metric, counter, fact

**Contact CTA**:
The closing call-to-action section of the Landing Page — an eyebrow, headline, body copy, and the Work with us button. Managed as the `contactCta` group on the Landing Page global.
_Avoid_: Contact section, CTA banner

### Design

**Design Tokens**:
The canonical visual values — colors and typography — shared by the Public site and the CMS Dashboard. Handed off from the Agency's Figma; `docs/DESIGN_SYSTEMS.md` is the source of record. One light mode only.
_Avoid_: Theme, palette, brand kit
