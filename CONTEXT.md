# Feugee

The public website and content management system for Feugee, a creative agency. Built for the agency by a contracted developer; content shape is defined by the agency over time.

## Language

### Public site

The visitor-facing part of the website. Animation-heavy (scroll and page transitions).

**Landing Page**:
The site's front page a visitor lands on first.
_Avoid_: Home, homepage

**Works Page**:
The public page listing every published Work.
_Avoid_: Portfolio page, projects page

**Work Detail Page**:
The public page presenting one Work in depth.
_Avoid_: Case study page, project page

**Work**:
A single portfolio piece the agency presents publicly. Richly detailed — not a simple record. Its field shape is still being defined by the agency.
_Avoid_: Project, portfolio item, case study

### CMS

The authenticated area where the agency manages public site content.

**CMS Dashboard**:
The admin area where the agency manages the content of the public pages.
_Avoid_: Admin panel, back office

**Agency**:
Feugee itself — the owner of the site and its content. Distinguished from a site visitor or the developer.
_Avoid_: Client, owner, user

**Asset**:
An uploaded image or video file managed by the CMS and referenced by site content.
_Avoid_: Media, file, upload

### Design

**Design Tokens**:
The canonical visual values — colors and typography — shared by the Public site and the CMS Dashboard. Handed off from the Agency's Figma; `docs/DESIGN_SYSTEMS.md` is the source of record. One light mode only.
_Avoid_: Theme, palette, brand kit
