import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "logo_wall_agribusiness_logos" ADD COLUMN "image_id" integer NOT NULL;
  ALTER TABLE "logo_wall_bank_logos" ADD COLUMN "image_id" integer NOT NULL;
  ALTER TABLE "logo_wall_agribusiness_logos" ADD CONSTRAINT "logo_wall_agribusiness_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "logo_wall_bank_logos" ADD CONSTRAINT "logo_wall_bank_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "logo_wall_agribusiness_logos_image_idx" ON "logo_wall_agribusiness_logos" USING btree ("image_id");
  CREATE INDEX "logo_wall_bank_logos_image_idx" ON "logo_wall_bank_logos" USING btree ("image_id");`)
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
