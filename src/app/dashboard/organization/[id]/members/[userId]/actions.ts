"use server"

import { db } from "@/db";
import { memberships, users, UserWithMemberships } from "@/db/schema";
import { handleApiRequest } from "@/helper";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function editUser({ data, userId, orgId }: {
    data: {
        email: string;
        phone?: string;
    }
    userId: string
    orgId: string
}) {
    return handleApiRequest(async () => {
        const res = await db.transaction(async (tx) => {
            await tx.update(users).set({
                email: data.email,
            }).where(eq(users.id, userId));

            const result = await tx.update(memberships).set({
                phone: data.phone,
            })
                .where(eq(memberships.userId, userId))
                .returning({ userId: memberships.userId });

            return result
        })

        revalidatePath(`/dashboard/organization/${orgId}/members/${userId}`);

        return res
    })
}