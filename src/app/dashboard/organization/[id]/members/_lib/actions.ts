"use server";

import { db } from "@/db";
import { unstable_noStore as noStore } from "next/cache"
import { memberships, organizations, SelectUsers, users } from "@/db/schema";
import { handleApiRequest } from "@/helper";
import { and, asc, count, desc, eq, gte, inArray, lte, or, SQL, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { filterColumn } from "@/lib/filter-column";
import { DrizzleWhere } from "@/types";
import { GetMembersSchema } from "./schema";
import { UpdateUserSchema } from "./validations";
import { getErrorMessage } from "@/lib/handle-error";



export async function getMembers(input: GetMembersSchema) {
  noStore();
  const { page, per_page, sort, email, operator, from, to, orgId } =
    input

  try {
    // Offset to paginate the results
    const offset = (page - 1) * per_page
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof SelectUsers | undefined, "asc" | "desc" | undefined]

    // Convert the date strings to date objects
    const fromDay = from ? sql`to_date(${from}, 'yyyy-mm-dd')` : undefined
    const toDay = to ? sql`to_date(${to}, 'yyy-mm-dd')` : undefined

    const expressions: (SQL<unknown> | undefined)[] = [
      email
        ? filterColumn({
          column: users.email,
          value: email,
        })
        : undefined,
      // Filter by createdAt
      fromDay && toDay
        ? and(gte(users.createdAt, fromDay), lte(users.createdAt, toDay))
        : undefined,
      eq(memberships.organizationId, orgId!)
    ]

    const where: DrizzleWhere<SelectUsers> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: users.id,
          email: users.email,
          phone: memberships.phone,
          firstName: users.firstName,
          lastName: users.lastName,
          subscriptionTier: users.subscriptionTier,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
          isActive: memberships.isActive,
          membershipId: memberships.id,
          role: users.role,
          emailVerified: users.emailVerified,
        })
        .from(users)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in users
            ? order === "asc"
              ? asc(users[column])
              : desc(users[column])
            : desc(users.id)
        )
        .leftJoin(memberships, eq(users.id, memberships.userId))
        .leftJoin(organizations, eq(memberships.organizationId, organizations.id))


      const total = await tx
        .select({
          count: count(),
        })
        .from(memberships)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total,
      }
    })

    const pageCount = Math.ceil(total / per_page)
    return { data, pageCount }
  } catch (err) {
    return { data: [], pageCount: 0 }
  }

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
          isActive: true,
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

export async function updateUser(input: UpdateUserSchema & { id: string, orgId: string }) {
  noStore()
  try {
    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          email: input.email,
        })
        .where(eq(users.id, input.id))

      await tx.update(memberships)
        .set({
          phone: input.phone
        })
        .where(eq(memberships.userId, input.id))
    })

    revalidatePath(`/dashboard/organization/${input.orgId}/members`)

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteMember({ userId, orgId }: { userId: string[], orgId: string }) {
  return handleApiRequest(async () => {
    await db.transaction(async (tx) => {
      await tx.delete(memberships).where(inArray(memberships.userId, userId))
      await tx.delete(users).where(inArray(users.id, userId))

    })

    revalidatePath(`/dashboard/organization/${orgId}/members`)
    return {
      data: null,
      error: null,
    }
  })
}

export async function toggleMembershipStatus({ isActive, membershipId }: { isActive: boolean, membershipId: string }) {
  noStore()
  return handleApiRequest(async () => {
    await db.transaction(async (tx) => {
      await tx.update(memberships)
        .set({
          isActive
        })
        .where(eq(memberships.id, membershipId))
    })

    revalidatePath(`/dashboard/organization/${membershipId}/members`)

    return {
      data: null,
      error: null,
    }
  })
}