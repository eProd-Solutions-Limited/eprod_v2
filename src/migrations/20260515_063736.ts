import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_articles_blocks_columns_layout" AS ENUM('2', '3');
  CREATE TABLE "articles_blocks_columns_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL
  );
  
  CREATE TABLE "articles_blocks_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_articles_blocks_columns_layout" DEFAULT '2',
  	"block_name" varchar
  );
  
  CREATE TABLE "articles_blocks_profile_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"job_title" varchar,
  	"company" varchar,
  	"question" varchar,
  	"answer" varchar NOT NULL,
  	"block_name" varchar
  );
  
  ALTER TABLE "articles_blocks_columns_columns" ADD CONSTRAINT "articles_blocks_columns_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_blocks_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_columns" ADD CONSTRAINT "articles_blocks_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_profile_quote" ADD CONSTRAINT "articles_blocks_profile_quote_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_profile_quote" ADD CONSTRAINT "articles_blocks_profile_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "articles_blocks_columns_columns_order_idx" ON "articles_blocks_columns_columns" USING btree ("_order");
  CREATE INDEX "articles_blocks_columns_columns_parent_id_idx" ON "articles_blocks_columns_columns" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_columns_order_idx" ON "articles_blocks_columns" USING btree ("_order");
  CREATE INDEX "articles_blocks_columns_parent_id_idx" ON "articles_blocks_columns" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_columns_path_idx" ON "articles_blocks_columns" USING btree ("_path");
  CREATE INDEX "articles_blocks_profile_quote_order_idx" ON "articles_blocks_profile_quote" USING btree ("_order");
  CREATE INDEX "articles_blocks_profile_quote_parent_id_idx" ON "articles_blocks_profile_quote" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_profile_quote_path_idx" ON "articles_blocks_profile_quote" USING btree ("_path");
  CREATE INDEX "articles_blocks_profile_quote_photo_idx" ON "articles_blocks_profile_quote" USING btree ("photo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "articles_blocks_columns_columns" CASCADE;
  DROP TABLE "articles_blocks_columns" CASCADE;
  DROP TABLE "articles_blocks_profile_quote" CASCADE;
  DROP TYPE "public"."enum_articles_blocks_columns_layout";`)
}
