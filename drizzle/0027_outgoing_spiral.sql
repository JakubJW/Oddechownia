ALTER TABLE "user_practice_schedules" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_practice_schedules" ADD COLUMN "readonly" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "user_practice_schedules" DROP COLUMN "send_reminder";