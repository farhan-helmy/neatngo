"use server";

import { db } from "@/db";
import { memberships, users } from "@/db/schema";
import { handleApiRequest } from "@/helper";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getMembers({
  organizationId,
}: {
  organizationId: string;
}) {
  // const res = await db.query.memberships.findMany({
  //     where: eq(memberships.organizationId, organizationId),
  //     with: {
  //         user: true
  //     }
  // })

  const res = await db
    .select({
      id: users.id,
      fullName: users.firstName,
      email: users.email,
      phoneNumber: memberships.phone,
    })
    .from(memberships)
    .where(eq(memberships.organizationId, organizationId))
    .leftJoin(users, eq(users.id, memberships.userId));

  console.log(res);
  return res;
}

export async function addMember({
  fullName,
  email,
  phone,
  organizationId,
}: {
  fullName: string;
  email: string;
  phone: string;
  organizationId: string;
}) {
  return handleApiRequest(async () => {
    const res = await db.transaction(async (tx) => {
      const userExistsInOrganization = await tx.query.users.findFirst({
        where: eq(users.email, email),
        with: {
          memberships: {
            with: {
              organization: {
                with: {
                  memberships: {
                    where: eq(memberships.organizationId, organizationId),
                  },
                },
              },
            },
          },
        },
      });

      if (userExistsInOrganization) {
        throw new Error("User already exists in organization");
      }

      const user = await tx
        .insert(users)
        .values({
          firstName: fullName,
          email,
        })
        .returning({
          id: users.id,
        });

      const membership = await tx
        .insert(memberships)
        .values({
          userId: user[0].id,
          organizationId,
          membershipStart: new Date().toISOString(),
          phone,
        })
        .returning({
          membershipId: memberships.id,
          organizationId: memberships.organizationId,
        });

      return membership;
    });

    revalidatePath(`/dashboard/organization/${organizationId}/members`);
    return res;
  });
}
