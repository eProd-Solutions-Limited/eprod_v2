import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "events" ALTER COLUMN "description" SET DATA TYPE jsonb USING "description"::jsonb;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "events" ALTER COLUMN "description" SET DATA TYPE varchar USING "description"::text;
  `)
}
