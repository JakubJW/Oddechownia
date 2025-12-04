CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"short_description" varchar(256),
	"content" text NOT NULL,
	"thumbnail_url" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "lesson_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "slug" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "post_id" integer;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "author_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "short_description";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "thumbnail_url";--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comment_parent_check" CHECK (
        ("comments"."lesson_id" IS NOT NULL AND "comments"."post_id" IS NULL) OR 
        ("comments"."lesson_id" IS NULL AND "comments"."post_id" IS NOT NULL)
      );