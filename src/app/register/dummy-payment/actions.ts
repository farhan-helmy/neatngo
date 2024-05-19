"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function paymentSuccess({ id }: { id: string }) {

    let res;
    const membershipType = await db.select({
        membershipType: users.membershipType
    }).from(users).where(eq(users.id, id))

    switch (membershipType[0].membershipType) {
        case "MONTHLY":
            res = await db.update(users).set({
                isPaid: true,
                membershipStart: new Date().toDateString(),
                membershipExpiry: new Date(Date.now() + 2629746000).toDateString()
            })
                .returning({ id: users.id });

            redirect(`/register/done?id=${res[0].id}`);
        case "ANNUAL":
            res = await db.update(users).set({
                isPaid: true,
                membershipStart: new Date().toDateString(),
                membershipExpiry: new Date(Date.now() + 31556952000).toDateString()
            })
                .returning({ id: users.id });

            redirect(`/register/done?id=${res[0].id}`);
        case "LIFETIME":
            res = await db.update(users).set({
                isPaid: true,
                membershipStart: new Date().toDateString(),
                membershipExpiry: "LIFETIME_NO_EXPIRY"
            })
                .returning({ id: users.id });

            redirect(`/register/done?id=${res[0].id}`);
        default:
            throw new Error("Invalid membership type");
    }
}

export async function paymentFailed() {
    redirect("/register/done/payment-failed");
}