"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { redirect } from "next/navigation";


interface RegisterUserStepOneSchema {
    firstName: string;
    lastName: string;
    email: string;
    icNumber: string;
    phone: string;
}

export default async function registerUserStepOne({ firstName, lastName, email, icNumber, phone }: RegisterUserStepOneSchema) {
    console.log("in")
    const res = await db.insert(users).values({
        firstName,
        lastName,
        email,
        icNumber,
        phone,
    }).returning({ id: users.id });

    console.log(res)

    if (res.length === 0) {
        throw new Error("Failed to register user");
    }

    redirect(`/register/step-two?id=${res[0].id}`);
}