ALTER TABLE "organizations" DROP CONSTRAINT "unique_slug";--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "unique_slug" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "unique_slug" SET NOT NULL;