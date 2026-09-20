import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_footer_social_links_platform" AS ENUM('facebook', 'instagram', 'x');
  CREATE TYPE "public"."enum_footer_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__footer_v_version_social_links_platform" AS ENUM('facebook', 'instagram', 'x');
  CREATE TYPE "public"."enum__footer_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "landing_page_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"job" varchar,
  	"company" varchar,
  	"testimony" varchar
  );
  
  CREATE TABLE "_landing_page_v_version_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"job" varchar,
  	"company" varchar,
  	"testimony" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "footer_menu_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "footer_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_social_links_platform",
  	"url" varchar
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"about_heading" varchar DEFAULT 'About',
  	"about_description" varchar,
  	"other_works_heading" varchar DEFAULT 'Other Works',
  	"menu_heading" varchar DEFAULT 'Menu',
  	"contact_heading" varchar DEFAULT 'Contact Us',
  	"contact_call_to_action" varchar,
  	"contact_call_to_action_url" varchar,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"wordmark" varchar DEFAULT 'FEUGEE STUDIO',
  	"location" varchar,
  	"copyright_name" varchar DEFAULT 'Feugee',
  	"_status" "enum_footer_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"works_id" integer
  );
  
  CREATE TABLE "_footer_v_version_menu_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v_version_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__footer_v_version_social_links_platform",
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_about_heading" varchar DEFAULT 'About',
  	"version_about_description" varchar,
  	"version_other_works_heading" varchar DEFAULT 'Other Works',
  	"version_menu_heading" varchar DEFAULT 'Menu',
  	"version_contact_heading" varchar DEFAULT 'Contact Us',
  	"version_contact_call_to_action" varchar,
  	"version_contact_call_to_action_url" varchar,
  	"version_contact_email" varchar,
  	"version_contact_phone" varchar,
  	"version_wordmark" varchar DEFAULT 'FEUGEE STUDIO',
  	"version_location" varchar,
  	"version_copyright_name" varchar DEFAULT 'Feugee',
  	"version__status" "enum__footer_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_footer_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"works_id" integer
  );
  
  ALTER TABLE "works" ADD COLUMN "short_description" varchar;
  ALTER TABLE "_works_v" ADD COLUMN "version_short_description" varchar;
  ALTER TABLE "landing_page" ADD COLUMN "testimonials_heading" varchar DEFAULT 'Testimonials';
  ALTER TABLE "landing_page" ADD COLUMN "testimonials_description" varchar;
  ALTER TABLE "landing_page" ADD COLUMN "contact_cta_eyebrow" varchar;
  ALTER TABLE "landing_page" ADD COLUMN "contact_cta_headline" varchar;
  ALTER TABLE "landing_page" ADD COLUMN "contact_cta_body" varchar;
  ALTER TABLE "landing_page" ADD COLUMN "contact_cta_action_label" varchar;
  ALTER TABLE "landing_page" ADD COLUMN "contact_cta_action_url" varchar;
  ALTER TABLE "_landing_page_v" ADD COLUMN "version_testimonials_heading" varchar DEFAULT 'Testimonials';
  ALTER TABLE "_landing_page_v" ADD COLUMN "version_testimonials_description" varchar;
  ALTER TABLE "_landing_page_v" ADD COLUMN "version_contact_cta_eyebrow" varchar;
  ALTER TABLE "_landing_page_v" ADD COLUMN "version_contact_cta_headline" varchar;
  ALTER TABLE "_landing_page_v" ADD COLUMN "version_contact_cta_body" varchar;
  ALTER TABLE "_landing_page_v" ADD COLUMN "version_contact_cta_action_label" varchar;
  ALTER TABLE "_landing_page_v" ADD COLUMN "version_contact_cta_action_url" varchar;
  ALTER TABLE "landing_page_testimonials_items" ADD CONSTRAINT "landing_page_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_page_v_version_testimonials_items" ADD CONSTRAINT "_landing_page_v_version_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_menu_links" ADD CONSTRAINT "footer_menu_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_social_links" ADD CONSTRAINT "footer_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_works_fk" FOREIGN KEY ("works_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_menu_links" ADD CONSTRAINT "_footer_v_version_menu_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_social_links" ADD CONSTRAINT "_footer_v_version_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_rels" ADD CONSTRAINT "_footer_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_rels" ADD CONSTRAINT "_footer_v_rels_works_fk" FOREIGN KEY ("works_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "landing_page_testimonials_items_order_idx" ON "landing_page_testimonials_items" USING btree ("_order");
  CREATE INDEX "landing_page_testimonials_items_parent_id_idx" ON "landing_page_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "_landing_page_v_version_testimonials_items_order_idx" ON "_landing_page_v_version_testimonials_items" USING btree ("_order");
  CREATE INDEX "_landing_page_v_version_testimonials_items_parent_id_idx" ON "_landing_page_v_version_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "footer_menu_links_order_idx" ON "footer_menu_links" USING btree ("_order");
  CREATE INDEX "footer_menu_links_parent_id_idx" ON "footer_menu_links" USING btree ("_parent_id");
  CREATE INDEX "footer_social_links_order_idx" ON "footer_social_links" USING btree ("_order");
  CREATE INDEX "footer_social_links_parent_id_idx" ON "footer_social_links" USING btree ("_parent_id");
  CREATE INDEX "footer__status_idx" ON "footer" USING btree ("_status");
  CREATE INDEX "footer_rels_order_idx" ON "footer_rels" USING btree ("order");
  CREATE INDEX "footer_rels_parent_idx" ON "footer_rels" USING btree ("parent_id");
  CREATE INDEX "footer_rels_path_idx" ON "footer_rels" USING btree ("path");
  CREATE INDEX "footer_rels_works_id_idx" ON "footer_rels" USING btree ("works_id");
  CREATE INDEX "_footer_v_version_menu_links_order_idx" ON "_footer_v_version_menu_links" USING btree ("_order");
  CREATE INDEX "_footer_v_version_menu_links_parent_id_idx" ON "_footer_v_version_menu_links" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_social_links_order_idx" ON "_footer_v_version_social_links" USING btree ("_order");
  CREATE INDEX "_footer_v_version_social_links_parent_id_idx" ON "_footer_v_version_social_links" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_version__status_idx" ON "_footer_v" USING btree ("version__status");
  CREATE INDEX "_footer_v_created_at_idx" ON "_footer_v" USING btree ("created_at");
  CREATE INDEX "_footer_v_updated_at_idx" ON "_footer_v" USING btree ("updated_at");
  CREATE INDEX "_footer_v_latest_idx" ON "_footer_v" USING btree ("latest");
  CREATE INDEX "_footer_v_autosave_idx" ON "_footer_v" USING btree ("autosave");
  CREATE INDEX "_footer_v_rels_order_idx" ON "_footer_v_rels" USING btree ("order");
  CREATE INDEX "_footer_v_rels_parent_idx" ON "_footer_v_rels" USING btree ("parent_id");
  CREATE INDEX "_footer_v_rels_path_idx" ON "_footer_v_rels" USING btree ("path");
  CREATE INDEX "_footer_v_rels_works_id_idx" ON "_footer_v_rels" USING btree ("works_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "landing_page_testimonials_items" CASCADE;
  DROP TABLE "_landing_page_v_version_testimonials_items" CASCADE;
  DROP TABLE "footer_menu_links" CASCADE;
  DROP TABLE "footer_social_links" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_rels" CASCADE;
  DROP TABLE "_footer_v_version_menu_links" CASCADE;
  DROP TABLE "_footer_v_version_social_links" CASCADE;
  DROP TABLE "_footer_v" CASCADE;
  DROP TABLE "_footer_v_rels" CASCADE;
  ALTER TABLE "works" DROP COLUMN "short_description";
  ALTER TABLE "_works_v" DROP COLUMN "version_short_description";
  ALTER TABLE "landing_page" DROP COLUMN "testimonials_heading";
  ALTER TABLE "landing_page" DROP COLUMN "testimonials_description";
  ALTER TABLE "landing_page" DROP COLUMN "contact_cta_eyebrow";
  ALTER TABLE "landing_page" DROP COLUMN "contact_cta_headline";
  ALTER TABLE "landing_page" DROP COLUMN "contact_cta_body";
  ALTER TABLE "landing_page" DROP COLUMN "contact_cta_action_label";
  ALTER TABLE "landing_page" DROP COLUMN "contact_cta_action_url";
  ALTER TABLE "_landing_page_v" DROP COLUMN "version_testimonials_heading";
  ALTER TABLE "_landing_page_v" DROP COLUMN "version_testimonials_description";
  ALTER TABLE "_landing_page_v" DROP COLUMN "version_contact_cta_eyebrow";
  ALTER TABLE "_landing_page_v" DROP COLUMN "version_contact_cta_headline";
  ALTER TABLE "_landing_page_v" DROP COLUMN "version_contact_cta_body";
  ALTER TABLE "_landing_page_v" DROP COLUMN "version_contact_cta_action_label";
  ALTER TABLE "_landing_page_v" DROP COLUMN "version_contact_cta_action_url";
  DROP TYPE "public"."enum_footer_social_links_platform";
  DROP TYPE "public"."enum_footer_status";
  DROP TYPE "public"."enum__footer_v_version_social_links_platform";
  DROP TYPE "public"."enum__footer_v_version_status";`)
}
