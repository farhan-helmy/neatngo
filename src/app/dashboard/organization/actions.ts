"use server";

import { db } from "@/db";
import { memberships, organizations, users } from "@/db/schema";
import { handleApiRequest } from "@/helper";
import { auth } from "@clerk/nextjs/server";
import { count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { toast } from "sonner";

export async function deleteOrganization({ id }: { id: string }) {
  // need to handle foreign key constraint
  await db.delete(organizations).where(eq(organizations.id, id));

  revalidatePath("/");
}


export async function addOrganization({ name }: { name: string }) {
  return handleApiRequest(async () => {
    const { sessionClaims } = auth();

    const res = await db.transaction(async (tx) => {
      const user = await tx.select({ id: users.id }).from(users).where(eq(users.email, sessionClaims?.email as string));

      if (!user) {
        throw new Error("User not found");
      }

      const organizationCount = await tx.select({
        organizationCount: count(organizations.id),
      })
        .from(users)
        .leftJoin(organizations, eq(organizations.createdById, user[0].id))


      if (organizationCount[0].organizationCount > 1) {
        throw new Error("You have reached the maximum number of organizations you can create")
      }

      const organization = await tx.insert(organizations).values({
        name,
        rosRegistrationNumber: "",
        createdById: user[0].id,
      }).returning({
        orgId: organizations.id,
      });

      return organization;
    })

    revalidatePath("/dashboard/organization")


    return res
  })
}   
