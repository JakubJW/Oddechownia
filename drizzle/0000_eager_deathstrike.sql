CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"is_published" boolean NOT NULL,
	"is_one_off" boolean DEFAULT false NOT NULL,
	"price_in_cents" integer,
	"stripe_price_id" varchar
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"course_id" integer NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"short_description" varchar(256),
	"content" text NOT NULL,
	"thumbnail_url" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stripe_prices" (
	"stripe_price_id" varchar PRIMARY KEY NOT NULL,
	"stripe_product_id" varchar NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"unit_amount" integer NOT NULL,
	"currency" varchar NOT NULL,
	"type" varchar NOT NULL,
	"interval" varchar,
	"interval_count" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stripe_products" (
	"stripe_product_id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"marketing_features" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_one_off_purchase" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"course_id" integer,
	"stripe_payment_intent_id" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_subscription" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"status" varchar,
	"stripe_subscription_id" text NOT NULL,
	"current_period_end" timestamp with time zone,
	CONSTRAINT "user_subscription_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"role" varchar DEFAULT 'user',
	"first_name" varchar,
	"last_name" varchar,
	"email" varchar NOT NULL,
	"regulations_agreement" boolean DEFAULT false,
	"privacy_policy_agreement" boolean DEFAULT false,
	"stripe_customer_id" varchar
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer,
	"upload_id" varchar NOT NULL,
	"public_playback_id" varchar,
	"private_playback_id" varchar,
	"duration" integer,
	"aspect_ratio" varchar,
	"status" varchar DEFAULT 'preparing' NOT NULL,
	CONSTRAINT "videos_lesson_id_unique" UNIQUE("lesson_id"),
	CONSTRAINT "videos_upload_id_unique" UNIQUE("upload_id")
);
--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"email_marketing_agreement" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stripe_prices" ADD CONSTRAINT "stripe_prices_stripe_product_id_stripe_products_stripe_product_id_fk" FOREIGN KEY ("stripe_product_id") REFERENCES "public"."stripe_products"("stripe_product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_one_off_purchase" ADD CONSTRAINT "user_one_off_purchase_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_one_off_purchase" ADD CONSTRAINT "user_one_off_purchase_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscription" ADD CONSTRAINT "user_subscription_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;