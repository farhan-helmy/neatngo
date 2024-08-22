ALTER TABLE "organizations" ALTER COLUMN "unique_slug" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_unique_slug_unique" UNIQUE("unique_slug");