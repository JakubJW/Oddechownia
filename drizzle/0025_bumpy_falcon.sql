ALTER TABLE "purchases" RENAME COLUMN "stripe_session_id" TO "checkout_session_id";--> statement-breakpoint
ALTER TABLE "ebooks" DROP CONSTRAINT "ebooks_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "price_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "subscriber_access" varchar DEFAULT 'paid' NOT NULL;--> statement-breakpoint
ALTER TABLE "ebooks" ADD CONSTRAINT "ebooks_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "stripe_price_id";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "is_free_for_subscribers";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "uses_monthly_quota";