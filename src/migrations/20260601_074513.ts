import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "cta_config_email_headers" CASCADE;
  DROP TABLE "cta_config_rels" CASCADE;
  ALTER TABLE "cta_config" RENAME COLUMN "email_to" TO "to";
  ALTER TABLE "cta_config" DROP COLUMN "email_from";
  ALTER TABLE "cta_config" DROP COLUMN "email_subject";
  ALTER TABLE "cta_config" DROP COLUMN "email_html_content";
  ALTER TABLE "cta_config" DROP COLUMN "email_body";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "cta_config_email_headers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "cta_config_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  ALTER TABLE "cta_config" RENAME COLUMN "to" TO "email_to";
  ALTER TABLE "cta_config" ADD COLUMN "email_from" varchar NOT NULL;
  ALTER TABLE "cta_config" ADD COLUMN "email_subject" varchar NOT NULL;
  ALTER TABLE "cta_config" ADD COLUMN "email_html_content" boolean DEFAULT true;
  ALTER TABLE "cta_config" ADD COLUMN "email_body" jsonb NOT NULL;
  ALTER TABLE "cta_config_email_headers" ADD CONSTRAINT "cta_config_email_headers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cta_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cta_config_rels" ADD CONSTRAINT "cta_config_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cta_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cta_config_rels" ADD CONSTRAINT "cta_config_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "cta_config_email_headers_order_idx" ON "cta_config_email_headers" USING btree ("_order");
  CREATE INDEX "cta_config_email_headers_parent_id_idx" ON "cta_config_email_headers" USING btree ("_parent_id");
  CREATE INDEX "cta_config_rels_order_idx" ON "cta_config_rels" USING btree ("order");
  CREATE INDEX "cta_config_rels_parent_idx" ON "cta_config_rels" USING btree ("parent_id");
  CREATE INDEX "cta_config_rels_path_idx" ON "cta_config_rels" USING btree ("path");
  CREATE INDEX "cta_config_rels_media_id_idx" ON "cta_config_rels" USING btree ("media_id");`)
}
