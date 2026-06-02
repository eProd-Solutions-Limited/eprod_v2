import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "articles" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "articles" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "case_studies" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "case_studies" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "case_studies" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "events" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "events" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "events" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "articles_meta_meta_image_idx" ON "articles" USING btree ("meta_image_id");
  CREATE INDEX "case_studies_meta_meta_image_idx" ON "case_studies" USING btree ("meta_image_id");
  CREATE INDEX "events_meta_meta_image_idx" ON "events" USING btree ("meta_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" DROP CONSTRAINT "articles_meta_image_id_media_id_fk";
  
  ALTER TABLE "case_studies" DROP CONSTRAINT "case_studies_meta_image_id_media_id_fk";
  
  ALTER TABLE "events" DROP CONSTRAINT "events_meta_image_id_media_id_fk";
  
  DROP INDEX "articles_meta_meta_image_idx";
  DROP INDEX "case_studies_meta_meta_image_idx";
  DROP INDEX "events_meta_meta_image_idx";
  ALTER TABLE "articles" DROP COLUMN "meta_title";
  ALTER TABLE "articles" DROP COLUMN "meta_description";
  ALTER TABLE "articles" DROP COLUMN "meta_image_id";
  ALTER TABLE "case_studies" DROP COLUMN "meta_title";
  ALTER TABLE "case_studies" DROP COLUMN "meta_description";
  ALTER TABLE "case_studies" DROP COLUMN "meta_image_id";
  ALTER TABLE "events" DROP COLUMN "meta_title";
  ALTER TABLE "events" DROP COLUMN "meta_description";
  ALTER TABLE "events" DROP COLUMN "meta_image_id";`)
}
