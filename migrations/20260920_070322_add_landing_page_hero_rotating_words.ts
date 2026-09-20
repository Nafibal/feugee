import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "landing_page_hero_rotating_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"word" varchar
  );
  
  CREATE TABLE "_landing_page_v_version_hero_rotating_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"word" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "landing_page_hero_rotating_words" ADD CONSTRAINT "landing_page_hero_rotating_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_page_v_version_hero_rotating_words" ADD CONSTRAINT "_landing_page_v_version_hero_rotating_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "landing_page_hero_rotating_words_order_idx" ON "landing_page_hero_rotating_words" USING btree ("_order");
  CREATE INDEX "landing_page_hero_rotating_words_parent_id_idx" ON "landing_page_hero_rotating_words" USING btree ("_parent_id");
  CREATE INDEX "_landing_page_v_version_hero_rotating_words_order_idx" ON "_landing_page_v_version_hero_rotating_words" USING btree ("_order");
  CREATE INDEX "_landing_page_v_version_hero_rotating_words_parent_id_idx" ON "_landing_page_v_version_hero_rotating_words" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "landing_page_hero_rotating_words" CASCADE;
  DROP TABLE "_landing_page_v_version_hero_rotating_words" CASCADE;`)
}
