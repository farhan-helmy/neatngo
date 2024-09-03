ALTER TABLE "guest_event_registrations" DROP CONSTRAINT "guest_event_registrations_guest_id_guests_email_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "guest_event_registrations" ADD CONSTRAINT "guest_event_registrations_guest_id_guests_id_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
