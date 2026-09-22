import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// The Assets collection regains imageSizes (WebP variants at thumbnail/
// tablet/desktop/wide — see the collection config). Two histories meet here:
// a database that replayed the chain has the 20260910_145544 size columns
// (and caption, which 8dbc30d dropped from the config without a migration),
// while dev databases pushed by `payload dev` had those columns dropped when
// the config lost them. IF EXISTS drops + fresh adds land both on the same
// four size groups.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "assets"
      DROP COLUMN IF EXISTS "caption",
      DROP COLUMN IF EXISTS "sizes_thumbnail_url",
      DROP COLUMN IF EXISTS "sizes_thumbnail_width",
      DROP COLUMN IF EXISTS "sizes_thumbnail_height",
      DROP COLUMN IF EXISTS "sizes_thumbnail_mime_type",
      DROP COLUMN IF EXISTS "sizes_thumbnail_filesize",
      DROP COLUMN IF EXISTS "sizes_thumbnail_filename",
      DROP COLUMN IF EXISTS "sizes_tablet_url",
      DROP COLUMN IF EXISTS "sizes_tablet_width",
      DROP COLUMN IF EXISTS "sizes_tablet_height",
      DROP COLUMN IF EXISTS "sizes_tablet_mime_type",
      DROP COLUMN IF EXISTS "sizes_tablet_filesize",
      DROP COLUMN IF EXISTS "sizes_tablet_filename",
      DROP COLUMN IF EXISTS "sizes_desktop_url",
      DROP COLUMN IF EXISTS "sizes_desktop_width",
      DROP COLUMN IF EXISTS "sizes_desktop_height",
      DROP COLUMN IF EXISTS "sizes_desktop_mime_type",
      DROP COLUMN IF EXISTS "sizes_desktop_filesize",
      DROP COLUMN IF EXISTS "sizes_desktop_filename";`)
  await db.execute(sql`
    ALTER TABLE "assets"
      ADD COLUMN "sizes_thumbnail_url" varchar,
      ADD COLUMN "sizes_thumbnail_width" numeric,
      ADD COLUMN "sizes_thumbnail_height" numeric,
      ADD COLUMN "sizes_thumbnail_mime_type" varchar,
      ADD COLUMN "sizes_thumbnail_filesize" numeric,
      ADD COLUMN "sizes_thumbnail_filename" varchar,
      ADD COLUMN "sizes_tablet_url" varchar,
      ADD COLUMN "sizes_tablet_width" numeric,
      ADD COLUMN "sizes_tablet_height" numeric,
      ADD COLUMN "sizes_tablet_mime_type" varchar,
      ADD COLUMN "sizes_tablet_filesize" numeric,
      ADD COLUMN "sizes_tablet_filename" varchar,
      ADD COLUMN "sizes_desktop_url" varchar,
      ADD COLUMN "sizes_desktop_width" numeric,
      ADD COLUMN "sizes_desktop_height" numeric,
      ADD COLUMN "sizes_desktop_mime_type" varchar,
      ADD COLUMN "sizes_desktop_filesize" numeric,
      ADD COLUMN "sizes_desktop_filename" varchar,
      ADD COLUMN "sizes_wide_url" varchar,
      ADD COLUMN "sizes_wide_width" numeric,
      ADD COLUMN "sizes_wide_height" numeric,
      ADD COLUMN "sizes_wide_mime_type" varchar,
      ADD COLUMN "sizes_wide_filesize" numeric,
      ADD COLUMN "sizes_wide_filename" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "assets"
      DROP COLUMN "sizes_thumbnail_url",
      DROP COLUMN "sizes_thumbnail_width",
      DROP COLUMN "sizes_thumbnail_height",
      DROP COLUMN "sizes_thumbnail_mime_type",
      DROP COLUMN "sizes_thumbnail_filesize",
      DROP COLUMN "sizes_thumbnail_filename",
      DROP COLUMN "sizes_tablet_url",
      DROP COLUMN "sizes_tablet_width",
      DROP COLUMN "sizes_tablet_height",
      DROP COLUMN "sizes_tablet_mime_type",
      DROP COLUMN "sizes_tablet_filesize",
      DROP COLUMN "sizes_tablet_filename",
      DROP COLUMN "sizes_desktop_url",
      DROP COLUMN "sizes_desktop_width",
      DROP COLUMN "sizes_desktop_height",
      DROP COLUMN "sizes_desktop_mime_type",
      DROP COLUMN "sizes_desktop_filesize",
      DROP COLUMN "sizes_desktop_filename",
      DROP COLUMN "sizes_wide_url",
      DROP COLUMN "sizes_wide_width",
      DROP COLUMN "sizes_wide_height",
      DROP COLUMN "sizes_wide_mime_type",
      DROP COLUMN "sizes_wide_filesize",
      DROP COLUMN "sizes_wide_filename";`)
}
