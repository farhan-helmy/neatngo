"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function registerStepFour({ id, nameOfDisorder, membershipType }: { id: string, nameOfDisorder: string, membershipType: string }) {

    const res = await db.update(users).set({
        membershipType,
        nameOfDisorder
    })
        .where(eq(users.id, id))
        .returning({ id: users.id });

    if (res.length === 0) {
        throw new Error("Failed to register user");
    }

    redirect(`/register/dummy-payment?id=${res[0].id}`);
}