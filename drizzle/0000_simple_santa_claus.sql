CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"is_published" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"course_id" integer NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"short_description" varchar(256),
	"content" text NOT NULL,
	"thumbnail_url" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"first_name" text,
	"last_name" text,
	"regulationsAgreement" boolean DEFAULT true,
	"privacyPolicyAgreement" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer,
	"upload_id" varchar NOT NULL,
	"public_playback_id" varchar,
	"private_playback_id" varchar,
	"duration" integer,
	"aspect_ratio" varchar,
	"status" varchar DEFAULT 'preparing' NOT NULL,
	CONSTRAINT "videos_lesson_id_unique" UNIQUE("lesson_id"),
	CONSTRAINT "videos_upload_id_unique" UNIQUE("upload_id")
);
--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;