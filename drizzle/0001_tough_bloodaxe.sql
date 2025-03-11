CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"short_description" varchar(256),
	"content" text NOT NULL,
	"thumbnail_url" varchar(256) NOT NULL
);
--> statement-breakpoint
DROP TABLE "blog_posts" CASCADE;