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
  serial,
} from "drizzle-orm/pg-core";

// = = = = = = = = = = = = = = = = = = Enums = = = = = = = = = = = = = = = = = =
export const userRoleEnum = pgEnum("user_role", [
  "SUPER_ADMIN",
  "ADMIN",
  "MEMBER",
  "GUEST",
  "ORG_OWNER",
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
  "MEETING",
  "OTHER",
  "VOLUNTEERING",
]);

export type EventType = (typeof eventTypeEnum.enumValues)[number];

export const donationStatusEnum = pgEnum("donation_status", [
  "PENDING",
  "COMPLETED",
  "FAILED",
]);

export const grantStatusEnum = pgEnum("grant_status", [
  "ACTIVE",
  "COMPLETED",
  "PENDING",
]);

// = = = = = = = = = = = = = = = = = = Tables = = = = = = = = = = = = = = = = = =
export const users = pgTable("users", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  email: text("email").unique().notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phoneNumber: text("phone_number").default(""),
  subscriptionTier: subscriptionTierEnum("subscription_tier")
    .default("FREE")
    .notNull(),
  role: userRoleEnum("role").default("GUEST").notNull(),
  emailVerified: boolean("email_verified").default(false),
  password: text("password").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const organizations = pgTable("organizations", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  fullName: text("full_name").default(""),
  about: text("about").default(""),
  uniqueSlug: text("unique_slug").unique().notNull(),
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
  otherEventType: text("other_event_type").default(""),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location"),
  isOnline: boolean("is_online").default(false),
  isPublished: boolean("is_published").default(false),
  isInternalEvent: boolean("is_internal_event").default(false),
  maxAttendees: integer("max_attendees"),
  headerImageUrl: text("header_image_url").default(""),
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

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date"
  }).notNull()
});

export const emailVerificationCodes = pgTable("email_verification_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  userId: text("user_id").notNull().unique().references(() => users.id),
  email: text("email").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const grants = pgTable("grants", {
  id: text("id").$defaultFn(() => createId()).primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  totalAmount: integer("total_amount").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  status: grantStatusEnum("status").default("ACTIVE").notNull(),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const grantAllocations = pgTable("grant_allocations", {
  id: text("id").$defaultFn(() => createId()).primaryKey(),
  grantId: text("grant_id").notNull().references(() => grants.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  amount: integer("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const grantTransactions = pgTable("grant_transactions", {
  id: text("id").$defaultFn(() => createId()).primaryKey(),
  grantId: text("grant_id").notNull().references(() => grants.id, { onDelete: "cascade" }),
  allocationId: text("allocation_id").notNull().references(() => grantAllocations.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  amount: integer("amount").notNull(),
  transactionDate: timestamp("transaction_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const guests = pgTable("guests", {
  id: text("id").$defaultFn(() => createId()).primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique(),
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const guestEventRegistrations = pgTable("guest_event_registrations", {
  id: text("id").$defaultFn(() => createId()).primaryKey(),
  guestId: text("guest_id").notNull().references(() => guests.id, { onDelete: "cascade" }),
  eventId: text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  registrationDate: timestamp("registration_date").defaultNow().notNull(),
  attended: boolean("attended").default(false),
  notes: text("notes"),
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
    grants: many(grants),
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
  guestRegistrations: many(guestEventRegistrations),
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

export const grantsRelations = relations(grants, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [grants.organizationId],
    references: [organizations.id],
  }),
  allocations: many(grantAllocations),
  transactions: many(grantTransactions),
}));

export const grantAllocationsRelations = relations(grantAllocations, ({ one, many }) => ({
  grant: one(grants, {
    fields: [grantAllocations.grantId],
    references: [grants.id],
  }),
  transactions: many(grantTransactions),
}));

export const grantTransactionsRelations = relations(grantTransactions, ({ one }) => ({
  grant: one(grants, {
    fields: [grantTransactions.grantId],
    references: [grants.id],
  }),
  allocation: one(grantAllocations, {
    fields: [grantTransactions.allocationId],
    references: [grantAllocations.id],
  }),
}));

export const guestsRelations = relations(guests, ({ many }) => ({
    eventRegistrations: many(guestEventRegistrations),
  }));

  export const guestEventRegistrationsRelations = relations(guestEventRegistrations, ({ one }) => ({
  guest: one(guests, {
    fields: [guestEventRegistrations.guestId],
    references: [guests.id],
  }),
  event: one(events, {
    fields: [guestEventRegistrations.eventId],
    references: [events.id],
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

export type EventWithOrganization = InferResultType<
  "events",
  { organization: true }
>;

export type SelectGrant = typeof grants.$inferSelect;

export type InsertGrant = typeof grants.$inferInsert;

export type InsertGrantAllocation = typeof grantAllocations.$inferInsert;

export type SelectTransactions = typeof grantTransactions.$inferSelect;

export type InsertTransactions = typeof grantTransactions.$inferInsert;

export type SelectGrantAllocation = typeof grantAllocations.$inferSelect;

export type SelectGuest = typeof guests.$inferSelect;

export type InsertGuest = typeof guests.$inferInsert;

export type SelectGuestEventRegistration = typeof guestEventRegistrations.$inferSelect;

export type InsertGuestEventRegistration = typeof guestEventRegistrations.$inferInsert;
