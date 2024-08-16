-- ALTER TYPE "event_type" ADD VALUE 'VOLUNTEERING';--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "is_public" boolean DEFAULT false NOT NULL;