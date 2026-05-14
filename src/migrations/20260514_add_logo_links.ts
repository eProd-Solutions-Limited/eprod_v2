import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "logo_wall_agribusiness_logos" ADD COLUMN IF NOT EXISTS "link" varchar;
    ALTER TABLE "logo_wall_bank_logos" ADD COLUMN IF NOT EXISTS "link" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "logo_wall_agribusiness_logos" DROP COLUMN "link";
    ALTER TABLE "logo_wall_bank_logos" DROP COLUMN "link";
  `)
}
