ALTER TABLE "diseases" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "diseases" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET NOT NULL;