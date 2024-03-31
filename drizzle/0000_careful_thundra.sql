DO $$ BEGIN
 CREATE TYPE "allowedUser" AS ENUM('All', 'Organization Members Only', 'Page Members Only');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "labels" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	CONSTRAINT "labels_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orgMemberships" (
	"userId" text NOT NULL,
	"orgId" varchar(50) NOT NULL,
	"approved" boolean DEFAULT false,
	CONSTRAINT "orgMemberships_userId_orgId_pk" PRIMARY KEY("userId","orgId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orgs" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"desc" varchar(3000) NOT NULL,
	"orgImageUrl" text DEFAULT '' NOT NULL,
	"orgFileKey" text DEFAULT '' NOT NULL,
	"orgVerified" boolean DEFAULT false NOT NULL,
	"adminId" text NOT NULL,
	"joinedAt" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pageMembershipRequests" (
	"userId" text NOT NULL,
	"pageId" varchar(12) NOT NULL,
	CONSTRAINT "pageMembershipRequests_userId_pageId_pk" PRIMARY KEY("userId","pageId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pageMemberships" (
	"userId" text NOT NULL,
	"pageId" varchar(12) NOT NULL,
	CONSTRAINT "pageMemberships_userId_pageId_pk" PRIMARY KEY("userId","pageId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pageSubscriptions" (
	"userId" text NOT NULL,
	"pageId" varchar(12) NOT NULL,
	CONSTRAINT "pageSubscriptions_userId_pageId_pk" PRIMARY KEY("userId","pageId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pages" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"desc" varchar(3000) NOT NULL,
	"orgId" varchar(50) NOT NULL,
	"pageImageUrl" text DEFAULT '' NOT NULL,
	"pageFileKey" text DEFAULT '' NOT NULL,
	"pageVerified" boolean NOT NULL,
	"moderatorEmail" text NOT NULL,
	"joinedAt" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "postLabels" (
	"postId" varchar(15) NOT NULL,
	"labelId" varchar(10) NOT NULL,
	CONSTRAINT "postLabels_labelId_postId_pk" PRIMARY KEY("labelId","postId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "postUserRegistration" (
	"userId" text NOT NULL,
	"postId" varchar(15) NOT NULL,
	CONSTRAINT "postUserRegistration_userId_postId_pk" PRIMARY KEY("userId","postId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"title" varchar(120) NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"json" json,
	"allowedUsers" "allowedUser" DEFAULT 'Page Members Only' NOT NULL,
	"max_registrations" integer DEFAULT 0 NOT NULL,
	"pageId" varchar(12) NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"username" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"phone" varchar,
	"bio" text,
	"joinedAt" timestamp DEFAULT now(),
	"updatedAt" timestamp,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nameIdx" ON "labels" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orgNameIdx" ON "orgs" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orgAdminIdx" ON "orgs" ("adminId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orgJoinedAtIdx" ON "orgs" ("joinedAt");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pageNameIdx" ON "pages" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pageOrgIdx" ON "pages" ("orgId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "moderatorEmailIdx" ON "pages" ("moderatorEmail");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pageJoinedAtIdx" ON "pages" ("joinedAt");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "titleIdx" ON "posts" ("title");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orgMemberships" ADD CONSTRAINT "orgMemberships_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orgMemberships" ADD CONSTRAINT "orgMemberships_orgId_orgs_id_fk" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orgs" ADD CONSTRAINT "orgs_adminId_user_id_fk" FOREIGN KEY ("adminId") REFERENCES "user"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pageMembershipRequests" ADD CONSTRAINT "pageMembershipRequests_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pageMembershipRequests" ADD CONSTRAINT "pageMembershipRequests_pageId_pages_id_fk" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pageMemberships" ADD CONSTRAINT "pageMemberships_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pageMemberships" ADD CONSTRAINT "pageMemberships_pageId_pages_id_fk" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pageSubscriptions" ADD CONSTRAINT "pageSubscriptions_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pageSubscriptions" ADD CONSTRAINT "pageSubscriptions_pageId_pages_id_fk" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pages" ADD CONSTRAINT "pages_orgId_orgs_id_fk" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pages" ADD CONSTRAINT "pages_moderatorEmail_user_email_fk" FOREIGN KEY ("moderatorEmail") REFERENCES "user"("email") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "postUserRegistration" ADD CONSTRAINT "postUserRegistration_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "postUserRegistration" ADD CONSTRAINT "postUserRegistration_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_pageId_pages_id_fk" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
