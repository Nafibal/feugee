# Payload 3 as the CMS layer

The site needs a rich, media-heavy CMS whose data model is still being defined by the client, delivered by a solo developer. We adopt Payload 3, installed directly into this Next.js app as a plugin, rather than building a custom dashboard on Drizzle + Better Auth.

## Considered Options

- **Custom dashboard** (Drizzle + Better Auth + hand-built admin) — full design control of the dashboard UX; rejected because the media library and the still-churning Work data model are the most expensive parts to hand-build. Better Auth had initially been selected for the CMS login and is superseded by Payload's built-in admin auth — the public site has no other users.
- **Payload 3** (chosen) — admin UI, admin auth, media library, and S3-compatible storage adapter out of the box; data lands in the same Postgres via `@payloadcms/db-postgres` (Drizzle-based). Trade-offs: the admin UI is opinionated, Payload owns the data layer (custom Drizzle queries remain possible), and the Next config must be ESM.

## Consequences

- No standalone auth library in the project; CMS users are managed by Payload.
- Content collections are defined in code and migrate via Payload — don't hand-write Drizzle migrations for Payload-managed tables.
- Verified compatible with this repo's Next.js 16.3.4 (Payload requires 16.2.6+; no `cacheComponents` in use).
