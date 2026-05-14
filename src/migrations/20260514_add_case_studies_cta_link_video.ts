import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "cta_link" varchar;
    ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "video_url" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "case_studies" DROP COLUMN IF EXISTS "cta_link";
    ALTER TABLE "case_studies" DROP COLUMN IF EXISTS "video_url";
  `)
}
