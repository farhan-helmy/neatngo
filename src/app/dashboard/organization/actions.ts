"use server";

import { db } from "@/db";
import { organizations, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { toast } from "sonner";

export async function addOrganization({ name }: { name: string }) {
  const { sessionClaims } = auth();

  const res = await db.transaction(async (tx) => {
    const user = await tx
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, sessionClaims?.email as string));

    if (!user) {
      throw new Error("User not found");
    }

    const organization = await tx
      .insert(organizations)
      .values({
        name,
        rosRegistrationNumber: "",
        createdById: user[0].id,
      })
      .returning({
        orgId: organizations.id,
      });

    revalidatePath("/");

    return organization;
  });

  return res;
}

export async function deleteOrganization({ id }: { id: string }) {
  // need to handle foreign key constraint
  await db.delete(organizations).where(eq(organizations.id, id));

  revalidatePath("/");
}
