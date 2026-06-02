import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "enquiry_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "to" varchar NOT NULL,
      "subject" varchar NOT NULL DEFAULT 'New Enquiry from {{company}}',
      "body" varchar,
      "updated_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
      "created_at" timestamp(3) with time zone NOT NULL DEFAULT now()
    );

    CREATE TABLE "enquiry_settings_cc" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "email" varchar
    );

    ALTER TABLE "enquiry_settings_cc"
      ADD CONSTRAINT "enquiry_settings_cc_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."enquiry_settings"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "enquiry_settings_cc_order_idx" ON "enquiry_settings_cc" USING btree ("_order");
    CREATE INDEX "enquiry_settings_cc_parent_id_idx" ON "enquiry_settings_cc" USING btree ("_parent_id");
    CREATE INDEX "enquiry_settings_updated_at_idx" ON "enquiry_settings" USING btree ("updated_at");
    CREATE INDEX "enquiry_settings_created_at_idx" ON "enquiry_settings" USING btree ("created_at");

    INSERT INTO "enquiry_settings" ("to", "subject", "updated_at", "created_at")
    SELECT "to", 'New Enquiry from {{company}}', now(), now()
    FROM "cta_config"
    LIMIT 1;

    DROP TABLE "cta_config" CASCADE;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "cta_config" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "to" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
      "created_at" timestamp(3) with time zone NOT NULL DEFAULT now()
    );

    CREATE INDEX "cta_config_updated_at_idx" ON "cta_config" USING btree ("updated_at");
    CREATE INDEX "cta_config_created_at_idx" ON "cta_config" USING btree ("created_at");

    INSERT INTO "cta_config" ("title", "to", "updated_at", "created_at")
    SELECT 'Main Enquiries', "to", "updated_at", "created_at"
    FROM "enquiry_settings"
    LIMIT 1;

    DROP TABLE "enquiry_settings_cc" CASCADE;
    DROP TABLE "enquiry_settings" CASCADE;
  `)
}
