"use server";

import { db } from "@/db";
import { memberships, organizations, users } from "@/db/schema";
import { handleApiRequest } from "@/helper";
import { auth } from "@clerk/nextjs/server";
import { count, eq } from "drizzle-orm";
import { revalidatePath, unstable_noStore } from "next/cache";

export async function addOrganization({ name }: { name: string }) {
  return handleApiRequest(async () => {
    const { sessionClaims } = auth();

    const email =
      process.env.ENVIRONMENT === "dev"
        ? process.env.DEMO_USER_EMAIL
        : sessionClaims?.email;

    const res = await db.transaction(async (tx) => {
      const user = await tx
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email as string));

      if (!user) {
        throw new Error("User not found");
      }

      const organizationCount = await tx
        .select({
          organizationCount: count(organizations.id),
        })
        .from(users)
        .leftJoin(organizations, eq(organizations.createdById, user[0].id));

      if (process.env.ENVIRONMENT !== "dev" && organizationCount[0].organizationCount > 1) {
        throw new Error("You have reached the maximum number of organizations you can create")
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

      return organization;
    });

    revalidatePath("/dashboard/organization");

    return res;
  });
}

export async function deleteOrganization({ id }: { id: string }) {
  // need to handle foreign key constraint
  await db.delete(organizations).where(eq(organizations.id, id));

  revalidatePath("/");
}

export async function toggleOrganizationStatus({
  isPublic,
  id,
}: {
  isPublic: boolean;
  id: string;
}) {
  unstable_noStore();
  return handleApiRequest(async () => {
    await db.transaction(async (tx) => {
      await tx
        .update(organizations)
        .set({
          isPublic,
        })
        .where(eq(organizations.id, id));
    });

    revalidatePath(`/dashboard/organization/${id}`);

    return {
      data: null,
      error: null,
    };
  });
}
