import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Payload 3.89+ tracks the storage object key on upload collections and the
// moment a password reset was requested on auth collections — both become
// selected columns, so databases migrated before the 3.90.1 bump lack them.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "assets" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "users" ADD COLUMN "reset_password_requested_at" timestamp(3) with time zone;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "assets" DROP COLUMN "_objectkey";
  ALTER TABLE "users" DROP COLUMN "reset_password_requested_at";`)
}
