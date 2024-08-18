import { InferResultType } from "@/helper";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  pgTable,
  primaryKey,
  text,
  timestamp,
  integer,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";

// = = = = = = = = = = = = = = = = = = Enums = = = = = = = = = = = = = = = = = =
export const userRoleEnum = pgEnum("user_role", [
  "SUPER_ADMIN",
  "ADMIN",
  "MEMBER",
  "GUEST",
]);

export const membershipTypeEnum = pgEnum("membership_type", [
  "MONTHLY",
  "ANNUAL",
  "LIFETIME",
]);

export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "FREE",
  "PAID",
]);

export const customFieldTypeEnum = pgEnum("custom_field_type", [
  "TEXT",
  "NUMBER",
  "DATE",
  "BOOLEAN",
  "SELECT",
]);

export const eventTypeEnum = pgEnum("event_type", [
  "WORKSHOP",
  "FUNDRAISER",
  "VOLUNTEERING",
  "MEETING",
  "OTHER",
]);

export type EventType = (typeof eventTypeEnum.enumValues)[number];

export const donationStatusEnum = pgEnum("donation_status", [
  "PENDING",
  "COMPLETED",
  "FAILED",
]);

// = = = = = = = = = = = = = = = = = = Tables = = = = = = = = = = = = = = = = = =
export const users = pgTable("users", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  email: text("email").unique().notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  subscriptionTier: subscriptionTierEnum("subscription_tier")
    .default("FREE")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const organizations = pgTable("organizations", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  rosRegistrationNumber: text("ros_registration_number").notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  createdById: text("created_by_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const memberships = pgTable("memberships", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id),
  role: userRoleEnum("role").default("MEMBER").notNull(),
  membershipType: membershipTypeEnum("membership_type"),
  isPaid: boolean("is_paid").default(false),
  membershipStart: date("membership_start_date"),
  membershipExpiry: date("membership_expiry"),
  isActive: boolean("is_active").default(true),
  // Standard fields
  icNumber: text("ic_number"),
  phone: text("phone"),
  address1: text("address_1"),
  address2: text("address_2"),
  city: text("city"),
  state: text("state"),
  postcode: text("postcode"),
  occupation: text("occupation"),
  // Custom fields
  customFieldValues: jsonb("custom_field_values"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const customFields = pgTable("custom_fields", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id),
  name: text("name").notNull(),
  type: customFieldTypeEnum("type").notNull(),
  isRequired: boolean("is_required").default(false),
  options: jsonb("options"), // For SELECT type fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  eventType: eventTypeEnum("event_type").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location"),
  isOnline: boolean("is_online").default(false),
  maxAttendees: integer("max_attendees"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Event Registrations table
export const eventRegistrations = pgTable("event_registrations", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  registrationDate: timestamp("registration_date").defaultNow().notNull(),
  attended: boolean("attended").default(false),
  notes: text("notes"),
});

export const donations = pgTable("donations", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  donorId: text("donor_id")
    .notNull()
    .references(() => donors.id),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id),
  amount: integer("amount").notNull(), // in smallest currency unit (e.g., cents)
  donationDate: timestamp("donation_date").defaultNow().notNull(),
  status: donationStatusEnum("status").default("PENDING").notNull(),
  paymentMethod: text("payment_method"), // e.g., "Credit Card", "Bank Transfer" - boleh guna enum later kalau dah decide payment method
  transactionId: text("transaction_id").unique(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const donors = pgTable("donors", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("user_id").references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").unique().notNull(),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  postcode: text("postcode"),
  country: text("country"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// = = = = = = = = = = = = = = = = = = Relations = = = = = = = = = = = = = = = = = =
export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(memberships),
  createdOrganizations: many(organizations),
  eventRegistrations: many(eventRegistrations),
}));

export const organizationsRelations = relations(
  organizations,
  ({ one, many }) => ({
    creator: one(users, {
      fields: [organizations.createdById],
      references: [users.id],
    }),
    memberships: many(memberships),
    customFields: many(customFields),
    events: many(events),
  })
);

export const membershipsRelations = relations(memberships, ({ one }) => ({
  user: one(users, {
    fields: [memberships.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [memberships.organizationId],
    references: [organizations.id],
  }),
}));

export const customFieldsRelations = relations(customFields, ({ one }) => ({
  organization: one(organizations, {
    fields: [customFields.organizationId],
    references: [organizations.id],
  }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [events.organizationId],
    references: [organizations.id],
  }),
  registrations: many(eventRegistrations),
}));

export const eventRegistrationsRelations = relations(
  eventRegistrations,
  ({ one }) => ({
    event: one(events, {
      fields: [eventRegistrations.eventId],
      references: [events.id],
    }),
    user: one(users, {
      fields: [eventRegistrations.userId],
      references: [users.id],
    }),
  })
);

export const donorsRelations = relations(donors, ({ one, many }) => ({
  user: one(users, {
    fields: [donors.userId],
    references: [users.id],
  }),
  donations: many(donations),
}));

export const donationsRelations = relations(donations, ({ one }) => ({
  donor: one(donors, {
    fields: [donations.donorId],
    references: [donors.id],
  }),
  organization: one(organizations, {
    fields: [donations.organizationId],
    references: [organizations.id],
  }),
}));

export type SelectEvent = typeof events.$inferSelect;
export type SelectMemberships = typeof memberships.$inferSelect;

export type SelectUsers = typeof users.$inferSelect;

export type MembershipsWithUser = InferResultType<
  "memberships",
  { user: true }
>;

export type UserWithMemberships = InferResultType<
  "users",
  { memberships: true }
>;

export type OrganizationWithMemberships = InferResultType<
  "organizations",
  { memberships: true }
>;
