ALTER TABLE "attachments" ADD COLUMN "internal_name" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "attachments" ADD COLUMN "created_at" text DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE "attachments" ADD COLUMN "updated_at" text DEFAULT (CURRENT_TIMESTAMP) NOT NULL;