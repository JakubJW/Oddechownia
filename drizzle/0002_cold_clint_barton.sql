CREATE TABLE "playlist_lesson" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer NOT NULL,
	"playlist_id" integer NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "unique_playlist_lesson_constraint" UNIQUE("playlist_id","lesson_id")
);
--> statement-breakpoint
CREATE TABLE "playlists" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text NOT NULL,
	"slug" varchar NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"position" integer NOT NULL,
	"created_at" text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	"updated_at" text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "videos" DROP CONSTRAINT "videos_lesson_id_unique";--> statement-breakpoint
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "videos" DROP CONSTRAINT "videos_lesson_id_lessons_id_fk";
--> statement-breakpoint
ALTER TABLE "lessons" ALTER COLUMN "name" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "lessons" ALTER COLUMN "description" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "lessons" ALTER COLUMN "slug" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "video_id" integer;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "created_at" text DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "updated_at" text DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE "playlist_lesson" ADD CONSTRAINT "playlist_lesson_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlist_lesson" ADD CONSTRAINT "playlist_lesson_playlist_id_playlists_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" DROP COLUMN "course_id";--> statement-breakpoint
ALTER TABLE "lessons" DROP COLUMN "position";--> statement-breakpoint
ALTER TABLE "videos" DROP COLUMN "lesson_id";