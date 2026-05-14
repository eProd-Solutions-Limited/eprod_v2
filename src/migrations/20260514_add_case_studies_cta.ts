import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "case_studies_cta" (
      "id" serial PRIMARY KEY NOT NULL,
      "heading" varchar,
      "description" varchar,
      "primary_button_label" varchar,
      "primary_button_link" varchar,
      "secondary_button_label" varchar,
      "secondary_button_link" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now(),
      "created_at" timestamp(3) with time zone DEFAULT now()
    );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "case_studies_cta";
  `)
}
