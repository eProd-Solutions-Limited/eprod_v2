import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "case_studies" DROP COLUMN IF EXISTS "result";
    ALTER TABLE "case_studies" ADD COLUMN "result" jsonb;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "case_studies" DROP COLUMN IF EXISTS "result";
    ALTER TABLE "case_studies" ADD COLUMN "result" varchar;
  `)
}
