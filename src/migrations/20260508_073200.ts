import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_articles_blocks_image_width" AS ENUM('full', 'half', 'inline');
  CREATE TYPE "public"."enum_case_studies_tag" AS ENUM('Financial Inclusion', 'EUDR Traceability', 'Operational Efficiency');
  CREATE TYPE "public"."enum_team_pages_blocks_image_media_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_team_pages_blocks_video_media_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_popups_buttons_action" AS ENUM('link', 'register', 'close');
  CREATE TYPE "public"."enum_popups_buttons_style" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  CREATE TYPE "public"."enum_popups_display_pages" AS ENUM('all', 'homepage', 'specific');
  CREATE TYPE "public"."enum_popups_display_frequency" AS ENUM('every-visit', 'once-per-session', 'once-per-day', 'once-per-week', 'once-ever');
  CREATE TYPE "public"."enum_popups_appearance_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_popups_appearance_badge_color" AS ENUM('brand', 'green', 'blue', 'orange', 'purple', 'red');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
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
  
  CREATE TABLE "articles_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "articles_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar,
  	"alt" varchar NOT NULL,
  	"width" "enum_articles_blocks_image_width",
  	"block_name" varchar
  );
  
  CREATE TABLE "articles_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"caption" varchar,
  	"autoplay" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "articles_blocks_gif" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"gif_id" integer NOT NULL,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "articles_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"author" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar,
  	"published_at" timestamp(3) with time zone,
  	"author_id" integer,
  	"cover_image_id" integer,
  	"category_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"cover_image_id" integer,
  	"client" varchar,
  	"tag" "enum_case_studies_tag",
  	"headline" varchar,
  	"situation" varchar,
  	"action" varchar,
  	"result" varchar,
  	"cta_label" varchar DEFAULT 'Read Full Case Study',
  	"has_video" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "team_pages_blocks_image_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"position" "enum_team_pages_blocks_image_media_position",
  	"block_name" varchar
  );
  
  CREATE TABLE "team_pages_blocks_video_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"position" "enum_team_pages_blocks_video_media_position",
  	"block_name" varchar
  );
  
  CREATE TABLE "team_pages_blocks_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "team_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "team" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"photo_id" integer NOT NULL,
  	"bio" varchar NOT NULL,
  	"linkedin" varchar,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cta_config_email_headers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "cta_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"email_to" varchar NOT NULL,
  	"email_from" varchar NOT NULL,
  	"email_subject" varchar NOT NULL,
  	"email_html_content" boolean DEFAULT true,
  	"email_body" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cta_config_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "popups_display_specific_paths" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"path" varchar
  );
  
  CREATE TABLE "popups_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"action" "enum_popups_buttons_action" DEFAULT 'link' NOT NULL,
  	"url" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"style" "enum_popups_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "popups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"is_active" boolean DEFAULT false,
  	"scheduling_start_date" timestamp(3) with time zone,
  	"scheduling_end_date" timestamp(3) with time zone,
  	"display_pages" "enum_popups_display_pages" DEFAULT 'all' NOT NULL,
  	"display_delay" numeric DEFAULT 2,
  	"display_frequency" "enum_popups_display_frequency" DEFAULT 'once-per-session' NOT NULL,
  	"content_badge" varchar,
  	"content_title" varchar NOT NULL,
  	"content_body" jsonb,
  	"content_image_id" integer,
  	"registration_notify_email" varchar,
  	"registration_email_subject" varchar DEFAULT 'New Registration',
  	"registration_collect_name" boolean DEFAULT true,
  	"registration_collect_phone" boolean DEFAULT false,
  	"registration_collect_organization" boolean DEFAULT false,
  	"registration_success_message" varchar DEFAULT 'You''re registered! We''ll be in touch soon.',
  	"appearance_size" "enum_popups_appearance_size" DEFAULT 'md',
  	"appearance_show_close_button" boolean DEFAULT true,
  	"appearance_close_on_overlay_click" boolean DEFAULT true,
  	"appearance_badge_color" "enum_popups_appearance_badge_color" DEFAULT 'brand',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"articles_id" integer,
  	"case_studies_id" integer,
  	"team_pages_id" integer,
  	"team_id" integer,
  	"cta_config_id" integer,
  	"popups_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "logo_wall_agribusiness_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "logo_wall_bank_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "logo_wall" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "voice_of_customer_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE "voice_of_customer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_rich_text" ADD CONSTRAINT "articles_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_image" ADD CONSTRAINT "articles_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_image" ADD CONSTRAINT "articles_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_video" ADD CONSTRAINT "articles_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_gif" ADD CONSTRAINT "articles_blocks_gif_gif_id_media_id_fk" FOREIGN KEY ("gif_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_blocks_gif" ADD CONSTRAINT "articles_blocks_gif_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_quote" ADD CONSTRAINT "articles_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_pages_blocks_image_media" ADD CONSTRAINT "team_pages_blocks_image_media_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_pages_blocks_image_media" ADD CONSTRAINT "team_pages_blocks_image_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_pages_blocks_video_media" ADD CONSTRAINT "team_pages_blocks_video_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_pages_blocks_section" ADD CONSTRAINT "team_pages_blocks_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team" ADD CONSTRAINT "team_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cta_config_email_headers" ADD CONSTRAINT "cta_config_email_headers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cta_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cta_config_rels" ADD CONSTRAINT "cta_config_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cta_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cta_config_rels" ADD CONSTRAINT "cta_config_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "popups_display_specific_paths" ADD CONSTRAINT "popups_display_specific_paths_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."popups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "popups_buttons" ADD CONSTRAINT "popups_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."popups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "popups" ADD CONSTRAINT "popups_content_image_id_media_id_fk" FOREIGN KEY ("content_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_pages_fk" FOREIGN KEY ("team_pages_id") REFERENCES "public"."team_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cta_config_fk" FOREIGN KEY ("cta_config_id") REFERENCES "public"."cta_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_popups_fk" FOREIGN KEY ("popups_id") REFERENCES "public"."popups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "logo_wall_agribusiness_logos" ADD CONSTRAINT "logo_wall_agribusiness_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."logo_wall"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "logo_wall_bank_logos" ADD CONSTRAINT "logo_wall_bank_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."logo_wall"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "voice_of_customer_quotes" ADD CONSTRAINT "voice_of_customer_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."voice_of_customer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "articles_blocks_rich_text_order_idx" ON "articles_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "articles_blocks_rich_text_parent_id_idx" ON "articles_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_rich_text_path_idx" ON "articles_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "articles_blocks_image_order_idx" ON "articles_blocks_image" USING btree ("_order");
  CREATE INDEX "articles_blocks_image_parent_id_idx" ON "articles_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_image_path_idx" ON "articles_blocks_image" USING btree ("_path");
  CREATE INDEX "articles_blocks_image_image_idx" ON "articles_blocks_image" USING btree ("image_id");
  CREATE INDEX "articles_blocks_video_order_idx" ON "articles_blocks_video" USING btree ("_order");
  CREATE INDEX "articles_blocks_video_parent_id_idx" ON "articles_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_video_path_idx" ON "articles_blocks_video" USING btree ("_path");
  CREATE INDEX "articles_blocks_gif_order_idx" ON "articles_blocks_gif" USING btree ("_order");
  CREATE INDEX "articles_blocks_gif_parent_id_idx" ON "articles_blocks_gif" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_gif_path_idx" ON "articles_blocks_gif" USING btree ("_path");
  CREATE INDEX "articles_blocks_gif_gif_idx" ON "articles_blocks_gif" USING btree ("gif_id");
  CREATE INDEX "articles_blocks_quote_order_idx" ON "articles_blocks_quote" USING btree ("_order");
  CREATE INDEX "articles_blocks_quote_parent_id_idx" ON "articles_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_quote_path_idx" ON "articles_blocks_quote" USING btree ("_path");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_author_idx" ON "articles" USING btree ("author_id");
  CREATE INDEX "articles_cover_image_idx" ON "articles" USING btree ("cover_image_id");
  CREATE INDEX "articles_category_idx" ON "articles" USING btree ("category_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "case_studies_cover_image_idx" ON "case_studies" USING btree ("cover_image_id");
  CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
  CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
  CREATE INDEX "team_pages_blocks_image_media_order_idx" ON "team_pages_blocks_image_media" USING btree ("_order");
  CREATE INDEX "team_pages_blocks_image_media_parent_id_idx" ON "team_pages_blocks_image_media" USING btree ("_parent_id");
  CREATE INDEX "team_pages_blocks_image_media_path_idx" ON "team_pages_blocks_image_media" USING btree ("_path");
  CREATE INDEX "team_pages_blocks_image_media_image_idx" ON "team_pages_blocks_image_media" USING btree ("image_id");
  CREATE INDEX "team_pages_blocks_video_media_order_idx" ON "team_pages_blocks_video_media" USING btree ("_order");
  CREATE INDEX "team_pages_blocks_video_media_parent_id_idx" ON "team_pages_blocks_video_media" USING btree ("_parent_id");
  CREATE INDEX "team_pages_blocks_video_media_path_idx" ON "team_pages_blocks_video_media" USING btree ("_path");
  CREATE INDEX "team_pages_blocks_section_order_idx" ON "team_pages_blocks_section" USING btree ("_order");
  CREATE INDEX "team_pages_blocks_section_parent_id_idx" ON "team_pages_blocks_section" USING btree ("_parent_id");
  CREATE INDEX "team_pages_blocks_section_path_idx" ON "team_pages_blocks_section" USING btree ("_path");
  CREATE INDEX "team_pages_updated_at_idx" ON "team_pages" USING btree ("updated_at");
  CREATE INDEX "team_pages_created_at_idx" ON "team_pages" USING btree ("created_at");
  CREATE INDEX "team_photo_idx" ON "team" USING btree ("photo_id");
  CREATE INDEX "team_updated_at_idx" ON "team" USING btree ("updated_at");
  CREATE INDEX "team_created_at_idx" ON "team" USING btree ("created_at");
  CREATE INDEX "cta_config_email_headers_order_idx" ON "cta_config_email_headers" USING btree ("_order");
  CREATE INDEX "cta_config_email_headers_parent_id_idx" ON "cta_config_email_headers" USING btree ("_parent_id");
  CREATE INDEX "cta_config_updated_at_idx" ON "cta_config" USING btree ("updated_at");
  CREATE INDEX "cta_config_created_at_idx" ON "cta_config" USING btree ("created_at");
  CREATE INDEX "cta_config_rels_order_idx" ON "cta_config_rels" USING btree ("order");
  CREATE INDEX "cta_config_rels_parent_idx" ON "cta_config_rels" USING btree ("parent_id");
  CREATE INDEX "cta_config_rels_path_idx" ON "cta_config_rels" USING btree ("path");
  CREATE INDEX "cta_config_rels_media_id_idx" ON "cta_config_rels" USING btree ("media_id");
  CREATE INDEX "popups_display_specific_paths_order_idx" ON "popups_display_specific_paths" USING btree ("_order");
  CREATE INDEX "popups_display_specific_paths_parent_id_idx" ON "popups_display_specific_paths" USING btree ("_parent_id");
  CREATE INDEX "popups_buttons_order_idx" ON "popups_buttons" USING btree ("_order");
  CREATE INDEX "popups_buttons_parent_id_idx" ON "popups_buttons" USING btree ("_parent_id");
  CREATE INDEX "popups_content_content_image_idx" ON "popups" USING btree ("content_image_id");
  CREATE INDEX "popups_updated_at_idx" ON "popups" USING btree ("updated_at");
  CREATE INDEX "popups_created_at_idx" ON "popups" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  CREATE INDEX "payload_locked_documents_rels_team_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("team_pages_id");
  CREATE INDEX "payload_locked_documents_rels_team_id_idx" ON "payload_locked_documents_rels" USING btree ("team_id");
  CREATE INDEX "payload_locked_documents_rels_cta_config_id_idx" ON "payload_locked_documents_rels" USING btree ("cta_config_id");
  CREATE INDEX "payload_locked_documents_rels_popups_id_idx" ON "payload_locked_documents_rels" USING btree ("popups_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "logo_wall_agribusiness_logos_order_idx" ON "logo_wall_agribusiness_logos" USING btree ("_order");
  CREATE INDEX "logo_wall_agribusiness_logos_parent_id_idx" ON "logo_wall_agribusiness_logos" USING btree ("_parent_id");
  CREATE INDEX "logo_wall_bank_logos_order_idx" ON "logo_wall_bank_logos" USING btree ("_order");
  CREATE INDEX "logo_wall_bank_logos_parent_id_idx" ON "logo_wall_bank_logos" USING btree ("_parent_id");
  CREATE INDEX "voice_of_customer_quotes_order_idx" ON "voice_of_customer_quotes" USING btree ("_order");
  CREATE INDEX "voice_of_customer_quotes_parent_id_idx" ON "voice_of_customer_quotes" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "articles_blocks_rich_text" CASCADE;
  DROP TABLE "articles_blocks_image" CASCADE;
  DROP TABLE "articles_blocks_video" CASCADE;
  DROP TABLE "articles_blocks_gif" CASCADE;
  DROP TABLE "articles_blocks_quote" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "case_studies" CASCADE;
  DROP TABLE "team_pages_blocks_image_media" CASCADE;
  DROP TABLE "team_pages_blocks_video_media" CASCADE;
  DROP TABLE "team_pages_blocks_section" CASCADE;
  DROP TABLE "team_pages" CASCADE;
  DROP TABLE "team" CASCADE;
  DROP TABLE "cta_config_email_headers" CASCADE;
  DROP TABLE "cta_config" CASCADE;
  DROP TABLE "cta_config_rels" CASCADE;
  DROP TABLE "popups_display_specific_paths" CASCADE;
  DROP TABLE "popups_buttons" CASCADE;
  DROP TABLE "popups" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "logo_wall_agribusiness_logos" CASCADE;
  DROP TABLE "logo_wall_bank_logos" CASCADE;
  DROP TABLE "logo_wall" CASCADE;
  DROP TABLE "voice_of_customer_quotes" CASCADE;
  DROP TABLE "voice_of_customer" CASCADE;
  DROP TYPE "public"."enum_articles_blocks_image_width";
  DROP TYPE "public"."enum_case_studies_tag";
  DROP TYPE "public"."enum_team_pages_blocks_image_media_position";
  DROP TYPE "public"."enum_team_pages_blocks_video_media_position";
  DROP TYPE "public"."enum_popups_buttons_action";
  DROP TYPE "public"."enum_popups_buttons_style";
  DROP TYPE "public"."enum_popups_display_pages";
  DROP TYPE "public"."enum_popups_display_frequency";
  DROP TYPE "public"."enum_popups_appearance_size";
  DROP TYPE "public"."enum_popups_appearance_badge_color";`)
}
