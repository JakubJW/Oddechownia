CREATE TABLE "ebooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"file_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"stripe_price_id" text NOT NULL,
	"image" text,
	"price" integer NOT NULL,
	"is_visible" boolean DEFAULT true,
	"is_free_for_subscribers" boolean DEFAULT false,
	"uses_monthly_quota" boolean DEFAULT false,
	"created_at" text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	"updated_at" text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "live_lessons_registrations" ALTER COLUMN "lessonId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "ebooks" ADD CONSTRAINT "ebooks_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;