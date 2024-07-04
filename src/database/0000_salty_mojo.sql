-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
DO $$ BEGIN
 CREATE TYPE "public"."sports_category" AS ENUM('master', 'candidate', 'adult-first', 'adult-second', 'adult-third', 'junior-first', 'junior-second', 'junior-third');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."tournament_type" AS ENUM('russian_championship', 'pro', 'federal', 'league', 'all_star', 'regional', 'national');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "knex_migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"batch" integer,
	"migration_time" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "knex_migrations_lock" (
	"index" serial PRIMARY KEY NOT NULL,
	"is_locked" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_data" (
	"rdga_number" integer PRIMARY KEY NOT NULL,
	"telegram_id" integer NOT NULL,
	"telegram_auth_date" integer NOT NULL,
	"telegram_username" text NOT NULL,
	"telegram_first_name" text DEFAULT '',
	"telegram_last_name" text DEFAULT '',
	"telegram_photo_url" text DEFAULT '',
	CONSTRAINT "auth_data_rdga_number_unique" UNIQUE("rdga_number"),
	CONSTRAINT "auth_data_telegram_id_unique" UNIQUE("telegram_id"),
	CONSTRAINT "auth_data_telegram_username_unique" UNIQUE("telegram_username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post" (
	"code" varchar(255) PRIMARY KEY NOT NULL,
	"author" varchar(255),
	"header" varchar(255) NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"author_rdga_number" integer NOT NULL,
	CONSTRAINT "posts_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player" (
	"rdga_number" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"surname" varchar(255) DEFAULT NULL::character varying,
	"rdga_rating" integer DEFAULT 0 NOT NULL,
	"rdga_rating_change" integer,
	"town" varchar(255) DEFAULT NULL::character varying,
	"pdga_number" integer,
	"metrix_number" integer,
	"active_to" date DEFAULT '2023-04-01' NOT NULL,
	"sports_category" "sports_category",
	CONSTRAINT "player_rdga_number_unique" UNIQUE("rdga_number"),
	CONSTRAINT "player_pdga_number_unique" UNIQUE("pdga_number"),
	CONSTRAINT "player_metrix_number_unique" UNIQUE("metrix_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tournament" (
	"code" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"town" varchar(255) NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"metrix_id" varchar(255) DEFAULT NULL::character varying,
	"tournament_type" "tournament_type" DEFAULT 'regional' NOT NULL,
	CONSTRAINT "tournaments_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_rdga_number" integer NOT NULL,
	"role_code" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "role" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"can_manage_players" boolean DEFAULT false NOT NULL,
	"can_manage_tournaments" boolean DEFAULT false NOT NULL,
	"can_manage_blog_post" boolean DEFAULT false NOT NULL,
	"can_manage_blog_posts" boolean DEFAULT false NOT NULL,
	"can_manage_roles" boolean DEFAULT false NOT NULL,
	"can_assign_roles" boolean DEFAULT false NOT NULL,
	CONSTRAINT "role_code_unique" UNIQUE("code")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_data" ADD CONSTRAINT "auth_data_rdga_number_foreign" FOREIGN KEY ("rdga_number") REFERENCES "public"."player"("rdga_number") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "posts_author_rdga_number_foreign" FOREIGN KEY ("author_rdga_number") REFERENCES "public"."player"("rdga_number") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_roles" ADD CONSTRAINT "player_roles_player_rdga_number_foreign" FOREIGN KEY ("player_rdga_number") REFERENCES "public"."player"("rdga_number") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_roles" ADD CONSTRAINT "player_roles_role_code_foreign" FOREIGN KEY ("role_code") REFERENCES "public"."role"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/