import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Catch-up for 8dbc30d's field drops (works description/duration, footer
// wordmark) and the size-filename indexes 20260922_211800 missed: its column
// drops cascaded the original three away, and its re-adds (plus sizes_wide)
// came back bare while its snapshot json still claims them. Same two
// histories as that migration: a database that replayed the chain lacks the
// indexes and carries the dropped columns, while dev databases pushed by
// `payload dev` have the indexes and lost the columns with the config.
// IF EXISTS / IF NOT EXISTS land both on the config's schema.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "assets_sizes_thumbnail_sizes_thumbnail_filename_idx"
      ON "assets" USING btree ("sizes_thumbnail_filename");
    CREATE INDEX IF NOT EXISTS "assets_sizes_tablet_sizes_tablet_filename_idx"
      ON "assets" USING btree ("sizes_tablet_filename");
    CREATE INDEX IF NOT EXISTS "assets_sizes_desktop_sizes_desktop_filename_idx"
      ON "assets" USING btree ("sizes_desktop_filename");
    CREATE INDEX IF NOT EXISTS "assets_sizes_wide_sizes_wide_filename_idx"
      ON "assets" USING btree ("sizes_wide_filename");
    ALTER TABLE "works" DROP COLUMN IF EXISTS "description";
    ALTER TABLE "works" DROP COLUMN IF EXISTS "duration";
    ALTER TABLE "_works_v" DROP COLUMN IF EXISTS "version_description";
    ALTER TABLE "_works_v" DROP COLUMN IF EXISTS "version_duration";
    ALTER TABLE "footer" DROP COLUMN IF EXISTS "wordmark";
    ALTER TABLE "_footer_v" DROP COLUMN IF EXISTS "version_wordmark";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX "assets_sizes_thumbnail_sizes_thumbnail_filename_idx";
    DROP INDEX "assets_sizes_tablet_sizes_tablet_filename_idx";
    DROP INDEX "assets_sizes_desktop_sizes_desktop_filename_idx";
    DROP INDEX "assets_sizes_wide_sizes_wide_filename_idx";
    ALTER TABLE "works" ADD COLUMN "description" jsonb;
    ALTER TABLE "works" ADD COLUMN "duration" varchar;
    ALTER TABLE "_works_v" ADD COLUMN "version_description" jsonb;
    ALTER TABLE "_works_v" ADD COLUMN "version_duration" varchar;
    ALTER TABLE "footer" ADD COLUMN "wordmark" varchar DEFAULT 'FEUGEE STUDIO';
    ALTER TABLE "_footer_v" ADD COLUMN "version_wordmark" varchar DEFAULT 'FEUGEE STUDIO';`)
}
