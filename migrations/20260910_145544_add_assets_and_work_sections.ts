import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "works_blocks_title" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "works_blocks_titled_text_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" jsonb
  );
  
  CREATE TABLE "works_blocks_titled_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "works_blocks_text_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" jsonb
  );
  
  CREATE TABLE "works_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "works_blocks_asset" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"asset_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "works_blocks_one_column" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "works_blocks_two_column" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "works_blocks_three_column" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "works_blocks_feature_left" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "works_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "_works_v_blocks_title" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_works_v_blocks_titled_text_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_works_v_blocks_titled_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_works_v_blocks_text_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_works_v_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_works_v_blocks_asset" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"asset_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_works_v_blocks_one_column" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_works_v_blocks_two_column" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_works_v_blocks_three_column" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_works_v_blocks_feature_left" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_works_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "assets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_tablet_url" varchar,
  	"sizes_tablet_width" numeric,
  	"sizes_tablet_height" numeric,
  	"sizes_tablet_mime_type" varchar,
  	"sizes_tablet_filesize" numeric,
  	"sizes_tablet_filename" varchar,
  	"sizes_desktop_url" varchar,
  	"sizes_desktop_width" numeric,
  	"sizes_desktop_height" numeric,
  	"sizes_desktop_mime_type" varchar,
  	"sizes_desktop_filesize" numeric,
  	"sizes_desktop_filename" varchar
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "assets_id" integer;
  ALTER TABLE "works_blocks_title" ADD CONSTRAINT "works_blocks_title_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "works_blocks_titled_text_entries" ADD CONSTRAINT "works_blocks_titled_text_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."works_blocks_titled_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "works_blocks_titled_text" ADD CONSTRAINT "works_blocks_titled_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "works_blocks_text_entries" ADD CONSTRAINT "works_blocks_text_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."works_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "works_blocks_text" ADD CONSTRAINT "works_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "works_blocks_asset" ADD CONSTRAINT "works_blocks_asset_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "works_blocks_asset" ADD CONSTRAINT "works_blocks_asset_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "works_blocks_one_column" ADD CONSTRAINT "works_blocks_one_column_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "works_blocks_two_column" ADD CONSTRAINT "works_blocks_two_column_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "works_blocks_three_column" ADD CONSTRAINT "works_blocks_three_column_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "works_blocks_feature_left" ADD CONSTRAINT "works_blocks_feature_left_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "works_sections" ADD CONSTRAINT "works_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_works_v_blocks_title" ADD CONSTRAINT "_works_v_blocks_title_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_works_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_works_v_blocks_titled_text_entries" ADD CONSTRAINT "_works_v_blocks_titled_text_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_works_v_blocks_titled_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_works_v_blocks_titled_text" ADD CONSTRAINT "_works_v_blocks_titled_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_works_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_works_v_blocks_text_entries" ADD CONSTRAINT "_works_v_blocks_text_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_works_v_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_works_v_blocks_text" ADD CONSTRAINT "_works_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_works_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_works_v_blocks_asset" ADD CONSTRAINT "_works_v_blocks_asset_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_works_v_blocks_asset" ADD CONSTRAINT "_works_v_blocks_asset_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_works_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_works_v_blocks_one_column" ADD CONSTRAINT "_works_v_blocks_one_column_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_works_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_works_v_blocks_two_column" ADD CONSTRAINT "_works_v_blocks_two_column_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_works_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_works_v_blocks_three_column" ADD CONSTRAINT "_works_v_blocks_three_column_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_works_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_works_v_blocks_feature_left" ADD CONSTRAINT "_works_v_blocks_feature_left_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_works_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_works_v_version_sections" ADD CONSTRAINT "_works_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_works_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "works_blocks_title_order_idx" ON "works_blocks_title" USING btree ("_order");
  CREATE INDEX "works_blocks_title_parent_id_idx" ON "works_blocks_title" USING btree ("_parent_id");
  CREATE INDEX "works_blocks_title_path_idx" ON "works_blocks_title" USING btree ("_path");
  CREATE INDEX "works_blocks_titled_text_entries_order_idx" ON "works_blocks_titled_text_entries" USING btree ("_order");
  CREATE INDEX "works_blocks_titled_text_entries_parent_id_idx" ON "works_blocks_titled_text_entries" USING btree ("_parent_id");
  CREATE INDEX "works_blocks_titled_text_order_idx" ON "works_blocks_titled_text" USING btree ("_order");
  CREATE INDEX "works_blocks_titled_text_parent_id_idx" ON "works_blocks_titled_text" USING btree ("_parent_id");
  CREATE INDEX "works_blocks_titled_text_path_idx" ON "works_blocks_titled_text" USING btree ("_path");
  CREATE INDEX "works_blocks_text_entries_order_idx" ON "works_blocks_text_entries" USING btree ("_order");
  CREATE INDEX "works_blocks_text_entries_parent_id_idx" ON "works_blocks_text_entries" USING btree ("_parent_id");
  CREATE INDEX "works_blocks_text_order_idx" ON "works_blocks_text" USING btree ("_order");
  CREATE INDEX "works_blocks_text_parent_id_idx" ON "works_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "works_blocks_text_path_idx" ON "works_blocks_text" USING btree ("_path");
  CREATE INDEX "works_blocks_asset_order_idx" ON "works_blocks_asset" USING btree ("_order");
  CREATE INDEX "works_blocks_asset_parent_id_idx" ON "works_blocks_asset" USING btree ("_parent_id");
  CREATE INDEX "works_blocks_asset_path_idx" ON "works_blocks_asset" USING btree ("_path");
  CREATE INDEX "works_blocks_asset_asset_idx" ON "works_blocks_asset" USING btree ("asset_id");
  CREATE INDEX "works_blocks_one_column_order_idx" ON "works_blocks_one_column" USING btree ("_order");
  CREATE INDEX "works_blocks_one_column_parent_id_idx" ON "works_blocks_one_column" USING btree ("_parent_id");
  CREATE INDEX "works_blocks_one_column_path_idx" ON "works_blocks_one_column" USING btree ("_path");
  CREATE INDEX "works_blocks_two_column_order_idx" ON "works_blocks_two_column" USING btree ("_order");
  CREATE INDEX "works_blocks_two_column_parent_id_idx" ON "works_blocks_two_column" USING btree ("_parent_id");
  CREATE INDEX "works_blocks_two_column_path_idx" ON "works_blocks_two_column" USING btree ("_path");
  CREATE INDEX "works_blocks_three_column_order_idx" ON "works_blocks_three_column" USING btree ("_order");
  CREATE INDEX "works_blocks_three_column_parent_id_idx" ON "works_blocks_three_column" USING btree ("_parent_id");
  CREATE INDEX "works_blocks_three_column_path_idx" ON "works_blocks_three_column" USING btree ("_path");
  CREATE INDEX "works_blocks_feature_left_order_idx" ON "works_blocks_feature_left" USING btree ("_order");
  CREATE INDEX "works_blocks_feature_left_parent_id_idx" ON "works_blocks_feature_left" USING btree ("_parent_id");
  CREATE INDEX "works_blocks_feature_left_path_idx" ON "works_blocks_feature_left" USING btree ("_path");
  CREATE INDEX "works_sections_order_idx" ON "works_sections" USING btree ("_order");
  CREATE INDEX "works_sections_parent_id_idx" ON "works_sections" USING btree ("_parent_id");
  CREATE INDEX "_works_v_blocks_title_order_idx" ON "_works_v_blocks_title" USING btree ("_order");
  CREATE INDEX "_works_v_blocks_title_parent_id_idx" ON "_works_v_blocks_title" USING btree ("_parent_id");
  CREATE INDEX "_works_v_blocks_title_path_idx" ON "_works_v_blocks_title" USING btree ("_path");
  CREATE INDEX "_works_v_blocks_titled_text_entries_order_idx" ON "_works_v_blocks_titled_text_entries" USING btree ("_order");
  CREATE INDEX "_works_v_blocks_titled_text_entries_parent_id_idx" ON "_works_v_blocks_titled_text_entries" USING btree ("_parent_id");
  CREATE INDEX "_works_v_blocks_titled_text_order_idx" ON "_works_v_blocks_titled_text" USING btree ("_order");
  CREATE INDEX "_works_v_blocks_titled_text_parent_id_idx" ON "_works_v_blocks_titled_text" USING btree ("_parent_id");
  CREATE INDEX "_works_v_blocks_titled_text_path_idx" ON "_works_v_blocks_titled_text" USING btree ("_path");
  CREATE INDEX "_works_v_blocks_text_entries_order_idx" ON "_works_v_blocks_text_entries" USING btree ("_order");
  CREATE INDEX "_works_v_blocks_text_entries_parent_id_idx" ON "_works_v_blocks_text_entries" USING btree ("_parent_id");
  CREATE INDEX "_works_v_blocks_text_order_idx" ON "_works_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_works_v_blocks_text_parent_id_idx" ON "_works_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_works_v_blocks_text_path_idx" ON "_works_v_blocks_text" USING btree ("_path");
  CREATE INDEX "_works_v_blocks_asset_order_idx" ON "_works_v_blocks_asset" USING btree ("_order");
  CREATE INDEX "_works_v_blocks_asset_parent_id_idx" ON "_works_v_blocks_asset" USING btree ("_parent_id");
  CREATE INDEX "_works_v_blocks_asset_path_idx" ON "_works_v_blocks_asset" USING btree ("_path");
  CREATE INDEX "_works_v_blocks_asset_asset_idx" ON "_works_v_blocks_asset" USING btree ("asset_id");
  CREATE INDEX "_works_v_blocks_one_column_order_idx" ON "_works_v_blocks_one_column" USING btree ("_order");
  CREATE INDEX "_works_v_blocks_one_column_parent_id_idx" ON "_works_v_blocks_one_column" USING btree ("_parent_id");
  CREATE INDEX "_works_v_blocks_one_column_path_idx" ON "_works_v_blocks_one_column" USING btree ("_path");
  CREATE INDEX "_works_v_blocks_two_column_order_idx" ON "_works_v_blocks_two_column" USING btree ("_order");
  CREATE INDEX "_works_v_blocks_two_column_parent_id_idx" ON "_works_v_blocks_two_column" USING btree ("_parent_id");
  CREATE INDEX "_works_v_blocks_two_column_path_idx" ON "_works_v_blocks_two_column" USING btree ("_path");
  CREATE INDEX "_works_v_blocks_three_column_order_idx" ON "_works_v_blocks_three_column" USING btree ("_order");
  CREATE INDEX "_works_v_blocks_three_column_parent_id_idx" ON "_works_v_blocks_three_column" USING btree ("_parent_id");
  CREATE INDEX "_works_v_blocks_three_column_path_idx" ON "_works_v_blocks_three_column" USING btree ("_path");
  CREATE INDEX "_works_v_blocks_feature_left_order_idx" ON "_works_v_blocks_feature_left" USING btree ("_order");
  CREATE INDEX "_works_v_blocks_feature_left_parent_id_idx" ON "_works_v_blocks_feature_left" USING btree ("_parent_id");
  CREATE INDEX "_works_v_blocks_feature_left_path_idx" ON "_works_v_blocks_feature_left" USING btree ("_path");
  CREATE INDEX "_works_v_version_sections_order_idx" ON "_works_v_version_sections" USING btree ("_order");
  CREATE INDEX "_works_v_version_sections_parent_id_idx" ON "_works_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "assets_updated_at_idx" ON "assets" USING btree ("updated_at");
  CREATE INDEX "assets_created_at_idx" ON "assets" USING btree ("created_at");
  CREATE UNIQUE INDEX "assets_filename_idx" ON "assets" USING btree ("filename");
  CREATE INDEX "assets_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "assets" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "assets_sizes_tablet_sizes_tablet_filename_idx" ON "assets" USING btree ("sizes_tablet_filename");
  CREATE INDEX "assets_sizes_desktop_sizes_desktop_filename_idx" ON "assets" USING btree ("sizes_desktop_filename");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_assets_fk" FOREIGN KEY ("assets_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_assets_id_idx" ON "payload_locked_documents_rels" USING btree ("assets_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "works_blocks_title" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "works_blocks_titled_text_entries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "works_blocks_titled_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "works_blocks_text_entries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "works_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "works_blocks_asset" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "works_blocks_one_column" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "works_blocks_two_column" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "works_blocks_three_column" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "works_blocks_feature_left" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "works_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_works_v_blocks_title" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_works_v_blocks_titled_text_entries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_works_v_blocks_titled_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_works_v_blocks_text_entries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_works_v_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_works_v_blocks_asset" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_works_v_blocks_one_column" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_works_v_blocks_two_column" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_works_v_blocks_three_column" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_works_v_blocks_feature_left" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_works_v_version_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "assets" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "works_blocks_title" CASCADE;
  DROP TABLE "works_blocks_titled_text_entries" CASCADE;
  DROP TABLE "works_blocks_titled_text" CASCADE;
  DROP TABLE "works_blocks_text_entries" CASCADE;
  DROP TABLE "works_blocks_text" CASCADE;
  DROP TABLE "works_blocks_asset" CASCADE;
  DROP TABLE "works_blocks_one_column" CASCADE;
  DROP TABLE "works_blocks_two_column" CASCADE;
  DROP TABLE "works_blocks_three_column" CASCADE;
  DROP TABLE "works_blocks_feature_left" CASCADE;
  DROP TABLE "works_sections" CASCADE;
  DROP TABLE "_works_v_blocks_title" CASCADE;
  DROP TABLE "_works_v_blocks_titled_text_entries" CASCADE;
  DROP TABLE "_works_v_blocks_titled_text" CASCADE;
  DROP TABLE "_works_v_blocks_text_entries" CASCADE;
  DROP TABLE "_works_v_blocks_text" CASCADE;
  DROP TABLE "_works_v_blocks_asset" CASCADE;
  DROP TABLE "_works_v_blocks_one_column" CASCADE;
  DROP TABLE "_works_v_blocks_two_column" CASCADE;
  DROP TABLE "_works_v_blocks_three_column" CASCADE;
  DROP TABLE "_works_v_blocks_feature_left" CASCADE;
  DROP TABLE "_works_v_version_sections" CASCADE;
  DROP TABLE "assets" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_assets_fk";
  
  DROP INDEX "payload_locked_documents_rels_assets_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "assets_id";`)
}
