CREATE TABLE IF NOT EXISTS "postLabels" (
	"postId" varchar(15) NOT NULL,
	"labelId" varchar(10) NOT NULL,
	CONSTRAINT "postLabels_labelId_postId_pk" PRIMARY KEY("labelId","postId")
);
--> statement-breakpoint
DROP TABLE "pageMembershipRequests";--> statement-breakpoint
ALTER TABLE "pageMemberships" ADD COLUMN "approved" boolean DEFAULT false;--> statement-breakpoint
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
