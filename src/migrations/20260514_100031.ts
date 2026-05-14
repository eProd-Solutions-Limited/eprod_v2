import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Create enum — swallow duplicate_object so dev-mode pushes don't block us
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_enquiries_status" AS ENUM('new', 'contacted', 'qualified', 'won', 'lost');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "enquiries" (
      "id" serial PRIMARY KEY NOT NULL,
      "company" varchar NOT NULL,
      "email" varchar NOT NULL,
      "challenge" varchar NOT NULL,
      "source_section" varchar,
      "status" "enum_enquiries_status" DEFAULT 'new',
      "notes" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "case_studies_hero" (
      "id" serial PRIMARY KEY NOT NULL,
      "alt" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "url" varchar,
      "thumbnail_u_r_l" varchar,
      "filename" varchar,
      "mime_type" varchar,
      "filesize" numeric,
      "width" numeric,
      "height" numeric,
      "focal_x" numeric,
      "focal_y" numeric
    );
  `)

  // Drop team_pages tables — they may already be gone from dev-mode pushes
  await db.execute(sql`
    ALTER TABLE IF EXISTS "team_pages_blocks_image_media" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS "team_pages_blocks_video_media" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS "team_pages_blocks_section" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS "team_pages" DISABLE ROW LEVEL SECURITY;
    DROP TABLE IF EXISTS "team_pages_blocks_image_media" CASCADE;
    DROP TABLE IF EXISTS "team_pages_blocks_video_media" CASCADE;
    DROP TABLE IF EXISTS "team_pages_blocks_section" CASCADE;
    DROP TABLE IF EXISTS "team_pages" CASCADE;
  `)

  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_team_pages_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_team_pages_id_idx";
  `)

  await db.execute(sql`
    ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "cta_link" varchar;
    ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "video_url" varchar;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "enquiries_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "case_studies_hero_id" integer;
    ALTER TABLE "logo_wall_agribusiness_logos" ADD COLUMN IF NOT EXISTS "link" varchar;
    ALTER TABLE "logo_wall_bank_logos" ADD COLUMN IF NOT EXISTS "link" varchar;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "enquiries_updated_at_idx" ON "enquiries" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "case_studies_hero_updated_at_idx" ON "case_studies_hero" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "case_studies_hero_created_at_idx" ON "case_studies_hero" USING btree ("created_at");
    CREATE UNIQUE INDEX IF NOT EXISTS "case_studies_hero_filename_idx" ON "case_studies_hero" USING btree ("filename");
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiries_fk"
        FOREIGN KEY ("enquiries_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_hero_fk"
        FOREIGN KEY ("case_studies_hero_id") REFERENCES "public"."case_studies_hero"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_enquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("enquiries_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_case_studies_hero_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_hero_id");
  `)

  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "team_pages_id";
    DROP TYPE IF EXISTS "public"."enum_team_pages_blocks_image_media_position";
    DROP TYPE IF EXISTS "public"."enum_team_pages_blocks_video_media_position";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_team_pages_blocks_image_media_position" AS ENUM('left', 'right');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_team_pages_blocks_video_media_position" AS ENUM('left', 'right');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "team_pages_blocks_image_media" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "position" "enum_team_pages_blocks_image_media_position",
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "team_pages_blocks_video_media" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "url" varchar,
      "position" "enum_team_pages_blocks_video_media_position",
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "team_pages_blocks_section" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" jsonb NOT NULL,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "team_pages" (
      "id" serial PRIMARY KEY NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  await db.execute(sql`
    ALTER TABLE IF EXISTS "enquiries" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS "case_studies_hero" DISABLE ROW LEVEL SECURITY;
    DROP TABLE IF EXISTS "enquiries" CASCADE;
    DROP TABLE IF EXISTS "case_studies_hero" CASCADE;
  `)

  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_enquiries_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_case_studies_hero_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_enquiries_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_case_studies_hero_id_idx";
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "team_pages_id" integer;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "team_pages_blocks_image_media" ADD CONSTRAINT "team_pages_blocks_image_media_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "team_pages_blocks_image_media" ADD CONSTRAINT "team_pages_blocks_image_media_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."team_pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "team_pages_blocks_video_media" ADD CONSTRAINT "team_pages_blocks_video_media_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."team_pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "team_pages_blocks_section" ADD CONSTRAINT "team_pages_blocks_section_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."team_pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "team_pages_blocks_image_media_order_idx" ON "team_pages_blocks_image_media" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "team_pages_blocks_image_media_parent_id_idx" ON "team_pages_blocks_image_media" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "team_pages_blocks_image_media_path_idx" ON "team_pages_blocks_image_media" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "team_pages_blocks_image_media_image_idx" ON "team_pages_blocks_image_media" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "team_pages_blocks_video_media_order_idx" ON "team_pages_blocks_video_media" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "team_pages_blocks_video_media_parent_id_idx" ON "team_pages_blocks_video_media" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "team_pages_blocks_video_media_path_idx" ON "team_pages_blocks_video_media" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "team_pages_blocks_section_order_idx" ON "team_pages_blocks_section" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "team_pages_blocks_section_parent_id_idx" ON "team_pages_blocks_section" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "team_pages_blocks_section_path_idx" ON "team_pages_blocks_section" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "team_pages_updated_at_idx" ON "team_pages" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "team_pages_created_at_idx" ON "team_pages" USING btree ("created_at");
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_pages_fk"
        FOREIGN KEY ("team_pages_id") REFERENCES "public"."team_pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_team_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("team_pages_id");
    ALTER TABLE "case_studies" DROP COLUMN IF EXISTS "cta_link";
    ALTER TABLE "case_studies" DROP COLUMN IF EXISTS "video_url";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "enquiries_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "case_studies_hero_id";
    ALTER TABLE "logo_wall_agribusiness_logos" DROP COLUMN IF EXISTS "link";
    ALTER TABLE "logo_wall_bank_logos" DROP COLUMN IF EXISTS "link";
    DROP TYPE IF EXISTS "public"."enum_enquiries_status";
  `)
}
