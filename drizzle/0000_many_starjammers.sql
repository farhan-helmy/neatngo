CREATE TABLE IF NOT EXISTS "diseases" (
	"id" text,
	"name" text,
	"description" text,
	"label" text,
	"value" text,
	"user_id" text,
	"created_at" date DEFAULT now(),
	"updated_at" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text,
	"first_name" text,
	"last_name" text,
	"email" text,
	"ic_number" text,
	"phone" text,
	"address_1" text,
	"address_2" text,
	"city" text,
	"state" text,
	"postcode" text,
	"occupation" text,
	"name_of_disorder" text,
	"membership_type" text,
	"is_paid" boolean DEFAULT false,
	"membership_start_date" date,
	"membership_expiry" date,
	"role" text,
	"created_at" date DEFAULT now(),
	"updated_at" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_diseases" (
	"user_id" text NOT NULL,
	"disease_id" text NOT NULL,
	CONSTRAINT "users_to_diseases_user_id_disease_id_pk" PRIMARY KEY("user_id","disease_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_diseases" ADD CONSTRAINT "users_to_diseases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_diseases" ADD CONSTRAINT "users_to_diseases_disease_id_diseases_id_fk" FOREIGN KEY ("disease_id") REFERENCES "public"."diseases"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
