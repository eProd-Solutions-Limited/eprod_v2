import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "enquiry_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "to" varchar NOT NULL,
      "subject" varchar NOT NULL DEFAULT 'New Enquiry from {{company}}',
      "body" varchar,
      "updated_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
      "created_at" timestamp(3) with time zone NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS "enquiry_settings_cc" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "email" varchar
    );

    DO $$ BEGIN
      ALTER TABLE "enquiry_settings_cc"
        ADD CONSTRAINT "enquiry_settings_cc_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."enquiry_settings"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE INDEX IF NOT EXISTS "enquiry_settings_cc_order_idx" ON "enquiry_settings_cc" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "enquiry_settings_cc_parent_id_idx" ON "enquiry_settings_cc" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "enquiry_settings_updated_at_idx" ON "enquiry_settings" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "enquiry_settings_created_at_idx" ON "enquiry_settings" USING btree ("created_at");

    DO $$ BEGIN
      IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cta_config') THEN
        IF NOT EXISTS (SELECT FROM "enquiry_settings" LIMIT 1) THEN
          INSERT INTO "enquiry_settings" ("to", "subject", "updated_at", "created_at")
          SELECT "to", 'New Enquiry from {{company}}', now(), now()
          FROM "cta_config"
          LIMIT 1;
        END IF;
        DROP TABLE "cta_config" CASCADE;
      END IF;
    END $$;
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
