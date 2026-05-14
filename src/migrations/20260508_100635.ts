import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "logo_wall_agribusiness_logos" ADD COLUMN IF NOT EXISTS "image_id" integer;
    ALTER TABLE "logo_wall_bank_logos" ADD COLUMN IF NOT EXISTS "image_id" integer;
    DO $$ BEGIN
      ALTER TABLE "logo_wall_agribusiness_logos" ADD CONSTRAINT "logo_wall_agribusiness_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "logo_wall_bank_logos" ADD CONSTRAINT "logo_wall_bank_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    CREATE INDEX IF NOT EXISTS "logo_wall_agribusiness_logos_image_idx" ON "logo_wall_agribusiness_logos" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "logo_wall_bank_logos_image_idx" ON "logo_wall_bank_logos" USING btree ("image_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "logo_wall_agribusiness_logos" DROP CONSTRAINT "logo_wall_agribusiness_logos_image_id_media_id_fk";
  
  ALTER TABLE "logo_wall_bank_logos" DROP CONSTRAINT "logo_wall_bank_logos_image_id_media_id_fk";
  
  DROP INDEX "logo_wall_agribusiness_logos_image_idx";
  DROP INDEX "logo_wall_bank_logos_image_idx";
  ALTER TABLE "logo_wall_agribusiness_logos" DROP COLUMN "image_id";
  ALTER TABLE "logo_wall_bank_logos" DROP COLUMN "image_id";`)
}
