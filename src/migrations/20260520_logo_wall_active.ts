import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "logo_wall_agribusiness_logos" ADD COLUMN IF NOT EXISTS "active" boolean DEFAULT true;
    ALTER TABLE "logo_wall_bank_logos" ADD COLUMN IF NOT EXISTS "active" boolean DEFAULT true;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "logo_wall_agribusiness_logos" DROP COLUMN "active";
    ALTER TABLE "logo_wall_bank_logos" DROP COLUMN "active";
  `)
}
