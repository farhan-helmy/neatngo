ALTER TABLE "grant_transactions" DROP CONSTRAINT "grant_transactions_allocation_id_grant_allocations_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "grant_transactions" ADD CONSTRAINT "grant_transactions_allocation_id_grant_allocations_id_fk" FOREIGN KEY ("allocation_id") REFERENCES "public"."grant_allocations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
