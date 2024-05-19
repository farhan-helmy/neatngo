import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { boolean, date, pgTable, primaryKey, text } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: text('id').$defaultFn(() => createId()).primaryKey(),
    firstName: text('first_name'),
    lastName: text('last_name'),
    email: text('email').unique(),
    icNumber: text('ic_number'),
    phone: text('phone'),
    address_1: text('address_1'),
    address_2: text('address_2'),
    city: text('city'),
    state: text('state'),
    postcode: text('postcode'),
    occupation: text('occupation'),
    nameOfDisorder: text('name_of_disorder'),
    // MONTHLY, ANNUAL, LIFETIME
    membershipType: text('membership_type'),
    isPaid: boolean('is_paid').default(false),
    membershipStart: date('membership_start_date'),
    membershipExpiry: date('membership_expiry'),
    role: text('role'),
    createdAt: date('created_at').defaultNow(),
    updatedAt: date('updated_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
    diseases: many(diseases)
}));

export const diseases = pgTable('diseases', {
    id: text('id').$defaultFn(() => createId()).primaryKey(),
    name: text('name'),
    description: text('description'),
    label: text('label'),
    value: text('value'),
    userId: text('user_id'),
    createdAt: date('created_at').defaultNow(),
    updatedAt: date('updated_at').defaultNow(),
})

export const diseasesRelations = relations(diseases, ({ one }) => ({
    sufferer: one(users, {
        fields: [diseases.userId],
        references: [users.id]
    })
}))

export const usersToDiseases = pgTable('users_to_diseases', {
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    diseaseId: text('disease_id')
        .notNull()
        .references(() => diseases.id),
},
    (t) => ({
        pk: primaryKey({ columns: [t.userId, t.diseaseId] })
    }))