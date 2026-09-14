import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_landing_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__landing_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "clients" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "landing_page_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"video_id" integer
  );
  
  CREATE TABLE "landing_page_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "landing_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title" varchar,
  	"hero_subtitle" varchar,
  	"who_we_are_heading" varchar DEFAULT 'Who We Are',
  	"who_we_are_description" varchar,
  	"_status" "enum_landing_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "landing_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"works_id" integer
  );
  
  CREATE TABLE "_landing_page_v_version_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"video_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_page_v_version_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_title" varchar,
  	"version_hero_subtitle" varchar,
  	"version_who_we_are_heading" varchar DEFAULT 'Who We Are',
  	"version_who_we_are_description" varchar,
  	"version__status" "enum__landing_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_landing_page_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"works_id" integer
  );
  
  ALTER TABLE "works" ADD COLUMN "year" numeric;
  ALTER TABLE "works" ADD COLUMN "duration" varchar;
  ALTER TABLE "_works_v" ADD COLUMN "version_year" numeric;
  ALTER TABLE "_works_v" ADD COLUMN "version_duration" varchar;
  ALTER TABLE "assets" ADD COLUMN "poster_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "clients_id" integer;
  ALTER TABLE "clients" ADD CONSTRAINT "clients_logo_id_assets_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_page_hero_slides" ADD CONSTRAINT "landing_page_hero_slides_video_id_assets_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_page_hero_slides" ADD CONSTRAINT "landing_page_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_page_stats" ADD CONSTRAINT "landing_page_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_page_rels" ADD CONSTRAINT "landing_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_page_rels" ADD CONSTRAINT "landing_page_rels_works_fk" FOREIGN KEY ("works_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_page_v_version_hero_slides" ADD CONSTRAINT "_landing_page_v_version_hero_slides_video_id_assets_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_page_v_version_hero_slides" ADD CONSTRAINT "_landing_page_v_version_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_page_v_version_stats" ADD CONSTRAINT "_landing_page_v_version_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_page_v_rels" ADD CONSTRAINT "_landing_page_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_page_v_rels" ADD CONSTRAINT "_landing_page_v_rels_works_fk" FOREIGN KEY ("works_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "clients__order_idx" ON "clients" USING btree ("_order");
  CREATE INDEX "clients_logo_idx" ON "clients" USING btree ("logo_id");
  CREATE INDEX "clients_updated_at_idx" ON "clients" USING btree ("updated_at");
  CREATE INDEX "clients_created_at_idx" ON "clients" USING btree ("created_at");
  CREATE INDEX "landing_page_hero_slides_order_idx" ON "landing_page_hero_slides" USING btree ("_order");
  CREATE INDEX "landing_page_hero_slides_parent_id_idx" ON "landing_page_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "landing_page_hero_slides_video_idx" ON "landing_page_hero_slides" USING btree ("video_id");
  CREATE INDEX "landing_page_stats_order_idx" ON "landing_page_stats" USING btree ("_order");
  CREATE INDEX "landing_page_stats_parent_id_idx" ON "landing_page_stats" USING btree ("_parent_id");
  CREATE INDEX "landing_page__status_idx" ON "landing_page" USING btree ("_status");
  CREATE INDEX "landing_page_rels_order_idx" ON "landing_page_rels" USING btree ("order");
  CREATE INDEX "landing_page_rels_parent_idx" ON "landing_page_rels" USING btree ("parent_id");
  CREATE INDEX "landing_page_rels_path_idx" ON "landing_page_rels" USING btree ("path");
  CREATE INDEX "landing_page_rels_works_id_idx" ON "landing_page_rels" USING btree ("works_id");
  CREATE INDEX "_landing_page_v_version_hero_slides_order_idx" ON "_landing_page_v_version_hero_slides" USING btree ("_order");
  CREATE INDEX "_landing_page_v_version_hero_slides_parent_id_idx" ON "_landing_page_v_version_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "_landing_page_v_version_hero_slides_video_idx" ON "_landing_page_v_version_hero_slides" USING btree ("video_id");
  CREATE INDEX "_landing_page_v_version_stats_order_idx" ON "_landing_page_v_version_stats" USING btree ("_order");
  CREATE INDEX "_landing_page_v_version_stats_parent_id_idx" ON "_landing_page_v_version_stats" USING btree ("_parent_id");
  CREATE INDEX "_landing_page_v_version_version__status_idx" ON "_landing_page_v" USING btree ("version__status");
  CREATE INDEX "_landing_page_v_created_at_idx" ON "_landing_page_v" USING btree ("created_at");
  CREATE INDEX "_landing_page_v_updated_at_idx" ON "_landing_page_v" USING btree ("updated_at");
  CREATE INDEX "_landing_page_v_latest_idx" ON "_landing_page_v" USING btree ("latest");
  CREATE INDEX "_landing_page_v_autosave_idx" ON "_landing_page_v" USING btree ("autosave");
  CREATE INDEX "_landing_page_v_rels_order_idx" ON "_landing_page_v_rels" USING btree ("order");
  CREATE INDEX "_landing_page_v_rels_parent_idx" ON "_landing_page_v_rels" USING btree ("parent_id");
  CREATE INDEX "_landing_page_v_rels_path_idx" ON "_landing_page_v_rels" USING btree ("path");
  CREATE INDEX "_landing_page_v_rels_works_id_idx" ON "_landing_page_v_rels" USING btree ("works_id");
  ALTER TABLE "assets" ADD CONSTRAINT "assets_poster_id_assets_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "assets_poster_idx" ON "assets" USING btree ("poster_id");
  CREATE INDEX "payload_locked_documents_rels_clients_id_idx" ON "payload_locked_documents_rels" USING btree ("clients_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "clients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "landing_page_hero_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "landing_page_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "landing_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "landing_page_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_landing_page_v_version_hero_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_landing_page_v_version_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_landing_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_landing_page_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "clients" CASCADE;
  DROP TABLE "landing_page_hero_slides" CASCADE;
  DROP TABLE "landing_page_stats" CASCADE;
  DROP TABLE "landing_page" CASCADE;
  DROP TABLE "landing_page_rels" CASCADE;
  DROP TABLE "_landing_page_v_version_hero_slides" CASCADE;
  DROP TABLE "_landing_page_v_version_stats" CASCADE;
  DROP TABLE "_landing_page_v" CASCADE;
  DROP TABLE "_landing_page_v_rels" CASCADE;
  ALTER TABLE "assets" DROP CONSTRAINT "assets_poster_id_assets_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_clients_fk";
  
  DROP INDEX "assets_poster_idx";
  DROP INDEX "payload_locked_documents_rels_clients_id_idx";
  ALTER TABLE "works" DROP COLUMN "year";
  ALTER TABLE "works" DROP COLUMN "duration";
  ALTER TABLE "_works_v" DROP COLUMN "version_year";
  ALTER TABLE "_works_v" DROP COLUMN "version_duration";
  ALTER TABLE "assets" DROP COLUMN "poster_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "clients_id";
  DROP TYPE "public"."enum_landing_page_status";
  DROP TYPE "public"."enum__landing_page_v_version_status";`)
}
