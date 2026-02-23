CREATE TABLE "purchases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"stripe_session_id" text,
	"created_at" text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	CONSTRAINT "unique_user_product" UNIQUE("user_id","product_id")
);
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "image" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "is_free_for_subscribers" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;