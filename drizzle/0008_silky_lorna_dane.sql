ALTER TABLE "postLabels" DROP CONSTRAINT "postLabels_labelId_postId_pk";--> statement-breakpoint
ALTER TABLE "postLabels" ADD PRIMARY KEY ("postId");