import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "works" ADD COLUMN "thumbnail_id" integer;
  ALTER TABLE "_works_v" ADD COLUMN "version_thumbnail_id" integer;
  ALTER TABLE "works" ADD CONSTRAINT "works_thumbnail_id_assets_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_works_v" ADD CONSTRAINT "_works_v_version_thumbnail_id_assets_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "works_thumbnail_idx" ON "works" USING btree ("thumbnail_id");
  CREATE INDEX "_works_v_version_version_thumbnail_idx" ON "_works_v" USING btree ("version_thumbnail_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "works" DROP CONSTRAINT "works_thumbnail_id_assets_id_fk";
  
  ALTER TABLE "_works_v" DROP CONSTRAINT "_works_v_version_thumbnail_id_assets_id_fk";
  
  DROP INDEX "works_thumbnail_idx";
  DROP INDEX "_works_v_version_version_thumbnail_idx";
  ALTER TABLE "works" DROP COLUMN "thumbnail_id";
  ALTER TABLE "_works_v" DROP COLUMN "version_thumbnail_id";`)
}
