import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "case_studies" ALTER COLUMN "result" SET DATA TYPE jsonb;
  ALTER TABLE "team" ADD COLUMN "is_leadership" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "case_studies" ALTER COLUMN "result" SET DATA TYPE varchar;
  ALTER TABLE "team" DROP COLUMN "is_leadership";`)
}
