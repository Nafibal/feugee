import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "works_blocks_feature_right" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "_works_v_blocks_feature_right" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "works_blocks_feature_right" ADD CONSTRAINT "works_blocks_feature_right_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_works_v_blocks_feature_right" ADD CONSTRAINT "_works_v_blocks_feature_right_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_works_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "works_blocks_feature_right_order_idx" ON "works_blocks_feature_right" USING btree ("_order");
  CREATE INDEX "works_blocks_feature_right_parent_id_idx" ON "works_blocks_feature_right" USING btree ("_parent_id");
  CREATE INDEX "works_blocks_feature_right_path_idx" ON "works_blocks_feature_right" USING btree ("_path");
  CREATE INDEX "_works_v_blocks_feature_right_order_idx" ON "_works_v_blocks_feature_right" USING btree ("_order");
  CREATE INDEX "_works_v_blocks_feature_right_parent_id_idx" ON "_works_v_blocks_feature_right" USING btree ("_parent_id");
  CREATE INDEX "_works_v_blocks_feature_right_path_idx" ON "_works_v_blocks_feature_right" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "works_blocks_feature_right" CASCADE;
  DROP TABLE "_works_v_blocks_feature_right" CASCADE;`)
}
