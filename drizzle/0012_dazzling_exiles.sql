CREATE TABLE "labels" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" varchar(50) NOT NULL,
	"color" varchar(20) NOT NULL,
	CONSTRAINT "labels_text_unique" UNIQUE("text")
);
--> statement-breakpoint
CREATE TABLE "lesson_labels" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer NOT NULL,
	"label_id" integer NOT NULL,
	CONSTRAINT "unique_label_lesson_constraint" UNIQUE("label_id","lesson_id")
);
--> statement-breakpoint
ALTER TABLE "lesson_labels" ADD CONSTRAINT "lesson_labels_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_labels" ADD CONSTRAINT "lesson_labels_label_id_labels_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."labels"("id") ON DELETE cascade ON UPDATE no action;