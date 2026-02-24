ALTER TABLE "ebooks" DROP CONSTRAINT "ebooks_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "purchases" ALTER COLUMN "checkout_session_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "acquisition_method" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ebooks" ADD CONSTRAINT "ebooks_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;