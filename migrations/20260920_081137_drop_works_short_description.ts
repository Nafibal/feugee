import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "works" DROP COLUMN "short_description";
  ALTER TABLE "_works_v" DROP COLUMN "version_short_description";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "works" ADD COLUMN "short_description" varchar;
  ALTER TABLE "_works_v" ADD COLUMN "version_short_description" varchar;`)
}
