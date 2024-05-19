"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

interface RegisterUserStepTwoSchema {
    id: string;
    address_1: string;
    address_2: string;
    postcode: string;
    city: string;
    state: string;
}

export default async function registerUserStepTwo({ id, address_1, address_2, postcode, city, state }: RegisterUserStepTwoSchema) {
    const res = await db.update(users).set({
        address_1,
        address_2,
        postcode,
        city,
        state
    })
        .where(eq(users.id, id))
        .returning({ id: users.id });

    if (res.length === 0) {
        throw new Error("Failed to register user");
    }

    redirect(`/register/step-three?id=${res[0].id}`);
}