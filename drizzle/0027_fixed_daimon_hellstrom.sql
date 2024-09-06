CREATE TABLE IF NOT EXISTS "guest_event_registrations" (
	"id" text PRIMARY KEY NOT NULL,
	"guest_id" text NOT NULL,
	"event_id" text NOT NULL,
	"registration_date" timestamp DEFAULT now() NOT NULL,
	"attended" boolean DEFAULT false,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "guests" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "guest_event_registrations" ADD CONSTRAINT "guest_event_registrations_guest_id_guests_email_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("email") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "guest_event_registrations" ADD CONSTRAINT "guest_event_registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
