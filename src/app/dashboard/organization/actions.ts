"use server";

import { db } from "@/db";
import { organizations } from "@/db/schema";

export async function addOrganization({ name }: { name: string }) {
    // const res = await db.insert(organizations).values({
    //     name,
    //     rosRegistrationNumber: "",
    //     createdById
    // })
}   