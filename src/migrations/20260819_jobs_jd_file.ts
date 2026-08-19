import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "jd_file_id" integer;
    DO $$ BEGIN ALTER TABLE "jobs" ADD CONSTRAINT "jobs_jd_file_id_media_id_fk" FOREIGN KEY ("jd_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    CREATE INDEX IF NOT EXISTS "jobs_jd_file_idx" ON "jobs" USING btree ("jd_file_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "jobs_jd_file_idx";
    ALTER TABLE "jobs" DROP CONSTRAINT IF EXISTS "jobs_jd_file_id_media_id_fk";
    ALTER TABLE "jobs" DROP COLUMN IF EXISTS "jd_file_id";
  `)
}
