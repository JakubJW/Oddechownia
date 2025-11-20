ALTER TABLE "live_lessons_registrations" DROP CONSTRAINT "unique_live_lesson_registration_constraint";--> statement-breakpoint
ALTER TABLE "live_lessons" ALTER COLUMN "created_at" SET DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE "live_lessons" ALTER COLUMN "updated_at" SET DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE "live_lessons_registrations" ALTER COLUMN "created_at" SET DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE "live_lessons_registrations" ALTER COLUMN "updated_at" SET DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE "lessons" ALTER COLUMN "created_at" SET DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE "lessons" ALTER COLUMN "updated_at" SET DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE "playlists" ALTER COLUMN "created_at" SET DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE "playlists" ALTER COLUMN "updated_at" SET DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "created_at" SET DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "updated_at" SET DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "created_at" SET DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "updated_at" SET DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE "user_favorite_lessons" ALTER COLUMN "created_at" SET DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE "playlists" ADD COLUMN "is_accessible_for_free" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "live_lessons_registrations" ADD CONSTRAINT "unique_live_lesson_registration_constraint" UNIQUE("email","lessonId");