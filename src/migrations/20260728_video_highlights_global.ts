import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Video Highlights global — the homepage video list, editable in the admin.
 *
 * Written to be idempotent: on environments where Payload's dev-mode schema push
 * already created these tables, the CREATE/INDEX steps no-op and only the seed
 * rows are added.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "video_highlights" (
      "id" serial PRIMARY KEY NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "video_highlights_videos" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "url" varchar,
      "title" varchar,
      "title_fr" varchar,
      "active" boolean DEFAULT true
    );

    ALTER TABLE "video_highlights_videos"
      DROP CONSTRAINT IF EXISTS "video_highlights_videos_parent_id_fk";

    ALTER TABLE "video_highlights_videos"
      ADD CONSTRAINT "video_highlights_videos_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."video_highlights"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "video_highlights_videos_order_idx" ON "video_highlights_videos" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "video_highlights_videos_parent_id_idx" ON "video_highlights_videos" USING btree ("_parent_id");

    INSERT INTO "video_highlights" ("updated_at", "created_at")
    SELECT now(), now()
    WHERE NOT EXISTS (SELECT 1 FROM "video_highlights");

    INSERT INTO "video_highlights_videos" ("_order", "_parent_id", "id", "url", "title", "title_fr", "active")
    SELECT
      seed."_order",
      (SELECT "id" FROM "video_highlights" ORDER BY "id" LIMIT 1),
      gen_random_uuid()::varchar,
      seed."url",
      seed."title",
      seed."title_fr",
      true
    FROM (VALUES
      (1, 'https://www.youtube.com/watch?v=K60ZdON-xO0', 'eProd Platform Overview', 'Présentation de la plateforme eProd'),
      (2, 'https://www.youtube.com/watch?v=2ipMHeav6go', 'Supply Chain Digitalization with eProd', 'Digitalisation de la chaîne d''approvisionnement avec eProd'),
      (3, 'https://www.youtube.com/watch?v=H8JB5GRUyE4', 'eProd in Action — Farmer Management', 'eProd en action — Gestion des producteurs')
    ) AS seed("_order", "url", "title", "title_fr")
    WHERE NOT EXISTS (SELECT 1 FROM "video_highlights_videos");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "video_highlights_videos" CASCADE;
    DROP TABLE IF EXISTS "video_highlights" CASCADE;
  `)
}
