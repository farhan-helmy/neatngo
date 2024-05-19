"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function registerStepThree({ id, occupation }: { id: string, occupation: string }) {
    const res = await db.update(users).set({
        occupation
    })
        .where(eq(users.id, id))
        .returning({ id: users.id });

    if (res.length === 0) {
        throw new Error("Failed to register user");
    }

    redirect(`/register/step-four?id=${res[0].id}`);
}