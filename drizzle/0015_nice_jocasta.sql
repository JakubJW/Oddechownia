CREATE TABLE "content_blocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_slug" text DEFAULT '/' NOT NULL,
	"type" text NOT NULL,
	"content" jsonb NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	"updated_at" text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
