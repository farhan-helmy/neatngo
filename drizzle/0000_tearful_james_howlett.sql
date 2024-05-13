CREATE TABLE IF NOT EXISTS "diseases" (
	"id" text,
	"name" text,
	"description" text,
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
