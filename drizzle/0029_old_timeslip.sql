ALTER TABLE "live_lessons" ADD COLUMN "product_id" uuid;--> statement-breakpoint
ALTER TABLE "live_lessons" ADD CONSTRAINT "live_lessons_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "live_lessons" ADD CONSTRAINT "live_lessons_product_id_unique" UNIQUE("product_id");