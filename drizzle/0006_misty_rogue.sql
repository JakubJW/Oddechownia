CREATE TABLE "user_practice_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"lesson_id" integer NOT NULL,
	"playlist_id" integer,
	"scheduled_at" timestamp with time zone NOT NULL,
	"is_completed" boolean DEFAULT false,
	"send_reminder" boolean DEFAULT false,
	"created_at" text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	"updated_at" text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_thumbnail_id_files_id_fk";
--> statement-breakpoint
ALTER TABLE "user_practice_schedules" ADD CONSTRAINT "user_practice_schedules_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_practice_schedules" ADD CONSTRAINT "user_practice_schedules_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_practice_schedules" ADD CONSTRAINT "user_practice_schedules_playlist_id_playlists_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_thumbnail_id_files_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."files"("id") ON DELETE restrict ON UPDATE no action;