import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer" ADD COLUMN "cta_eyebrow" varchar;
  ALTER TABLE "footer" ADD COLUMN "cta_headline" varchar;
  ALTER TABLE "footer" ADD COLUMN "cta_body" varchar;
  ALTER TABLE "footer" ADD COLUMN "cta_action_label" varchar;
  ALTER TABLE "footer" ADD COLUMN "cta_action_url" varchar;
  ALTER TABLE "_footer_v" ADD COLUMN "version_cta_eyebrow" varchar;
  ALTER TABLE "_footer_v" ADD COLUMN "version_cta_headline" varchar;
  ALTER TABLE "_footer_v" ADD COLUMN "version_cta_body" varchar;
  ALTER TABLE "_footer_v" ADD COLUMN "version_cta_action_label" varchar;
  ALTER TABLE "_footer_v" ADD COLUMN "version_cta_action_url" varchar;
  ALTER TABLE "landing_page" DROP COLUMN "contact_cta_eyebrow";
  ALTER TABLE "landing_page" DROP COLUMN "contact_cta_headline";
  ALTER TABLE "landing_page" DROP COLUMN "contact_cta_body";
  ALTER TABLE "landing_page" DROP COLUMN "contact_cta_action_label";
  ALTER TABLE "landing_page" DROP COLUMN "contact_cta_action_url";
  ALTER TABLE "_landing_page_v" DROP COLUMN "version_contact_cta_eyebrow";
  ALTER TABLE "_landing_page_v" DROP COLUMN "version_contact_cta_headline";
  ALTER TABLE "_landing_page_v" DROP COLUMN "version_contact_cta_body";
  ALTER TABLE "_landing_page_v" DROP COLUMN "version_contact_cta_action_label";
  ALTER TABLE "_landing_page_v" DROP COLUMN "version_contact_cta_action_url";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "landing_page" ADD COLUMN "contact_cta_eyebrow" varchar;
  ALTER TABLE "landing_page" ADD COLUMN "contact_cta_headline" varchar;
  ALTER TABLE "landing_page" ADD COLUMN "contact_cta_body" varchar;
  ALTER TABLE "landing_page" ADD COLUMN "contact_cta_action_label" varchar;
  ALTER TABLE "landing_page" ADD COLUMN "contact_cta_action_url" varchar;
  ALTER TABLE "_landing_page_v" ADD COLUMN "version_contact_cta_eyebrow" varchar;
  ALTER TABLE "_landing_page_v" ADD COLUMN "version_contact_cta_headline" varchar;
  ALTER TABLE "_landing_page_v" ADD COLUMN "version_contact_cta_body" varchar;
  ALTER TABLE "_landing_page_v" ADD COLUMN "version_contact_cta_action_label" varchar;
  ALTER TABLE "_landing_page_v" ADD COLUMN "version_contact_cta_action_url" varchar;
  ALTER TABLE "footer" DROP COLUMN "cta_eyebrow";
  ALTER TABLE "footer" DROP COLUMN "cta_headline";
  ALTER TABLE "footer" DROP COLUMN "cta_body";
  ALTER TABLE "footer" DROP COLUMN "cta_action_label";
  ALTER TABLE "footer" DROP COLUMN "cta_action_url";
  ALTER TABLE "_footer_v" DROP COLUMN "version_cta_eyebrow";
  ALTER TABLE "_footer_v" DROP COLUMN "version_cta_headline";
  ALTER TABLE "_footer_v" DROP COLUMN "version_cta_body";
  ALTER TABLE "_footer_v" DROP COLUMN "version_cta_action_label";
  ALTER TABLE "_footer_v" DROP COLUMN "version_cta_action_url";`)
}
