CREATE TABLE IF NOT EXISTS "labels" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	CONSTRAINT "labels_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "postLabels" (
	"postId" varchar(15) NOT NULL,
	"labelId" varchar(10) NOT NULL,
	CONSTRAINT "postLabels_labelId_postId_pk" PRIMARY KEY("labelId","postId")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nameIdx" ON "labels" ("name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "postLabels" ADD CONSTRAINT "postLabels_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "postLabels" ADD CONSTRAINT "postLabels_labelId_labels_id_fk" FOREIGN KEY ("labelId") REFERENCES "labels"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
