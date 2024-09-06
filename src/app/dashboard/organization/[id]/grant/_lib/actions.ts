"use server";

import { db } from "@/db";
import { grantAllocations, grants, InsertGrant, InsertGrantAllocation, SelectGrant } from "@/db/schema";
import { handleApiRequest } from "@/helper";
import { DrizzleWhere } from "@/types";
import { GetGrantsSchema } from "./schema";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import {
    and,
    asc,
    count,
    desc,
    eq,
    gte,
    inArray,
    lte,
    or,
    SQL,
    sql,
} from "drizzle-orm";
import { filterColumn } from "@/lib/filter-column";

export async function getGrants(input: GetGrantsSchema) {
    noStore();
    const {
        page,
        per_page,
        sort,
        name,
        startDate,
        endDate,
        status,
        category,
        totalAmount,
        operator,
        orgId,
        from,
        to
    } = input

    try {
        const offset = (page - 1) * per_page
        const [column, order] = (sort?.split(".").filter(Boolean) ?? ["createdAt", "desc"]) as [keyof SelectGrant | undefined, "asc" | "desc" | undefined]
        const fromDay = from ? sql`to_date(${from}, 'yyyy-mm-dd')` : undefined;
        const toDay = to ? sql`to_date(${to}, 'yyy-mm-dd')` : undefined;

        const expressions: (SQL<unknown> | undefined)[] = [
            name
                ? filterColumn({
                    column: grants.name,
                    value: name,
                })
                : undefined,
            startDate
                ? filterColumn({
                    column: grants.startDate,
                    value: startDate,
                })
                : undefined,
            endDate
                ? filterColumn({
                    column: grants.endDate,
                    value: endDate,
                })
                : undefined,
            status
                ? filterColumn({
                    column: grants.status,
                    value: status,
                })
                : undefined,
            category
                ? filterColumn({
                    column: grants.category,
                    value: category,
                })
                : undefined,
            totalAmount
                ? filterColumn({
                    column: grants.totalAmount,
                    value: totalAmount.toString(),
                })
                : undefined,
            eq(grants.organizationId, orgId!),
        ]

        const where: DrizzleWhere<SelectGrant> =
            !operator || operator === "and"
                ? and(...expressions)
                : or(...expressions);

        const { data, total } = await db.transaction(async (tx) => {
            const data = await tx
                .select()
                .from(grants)
                .limit(per_page)
                .offset(offset)
                .where(where)
                .orderBy(
                    column && column in grants
                        ? order === "asc"
                            ? asc(grants[column])
                            : desc(grants[column])
                        : desc(grants.id)
                );

            const total = await tx
                .select({
                    count: count(),
                })
                .from(grants)
                .where(where)
                .execute()
                .then((res) => res[0]?.count ?? 0);

            return { data, total };
        })

        const pageCount = Math.ceil(total / per_page);
        return { data, pageCount };
    } catch (error) {
        console.log(error)
        return { data: [], pageCount: 0 };
    }
}

export async function addGrant(input: InsertGrant) {
    return handleApiRequest(async () => {
        const res = await db.transaction(async (tx) => {
            const grant = await tx.insert(grants).values(input).returning({
                id: grants.id
            });
            return grant
        })

        revalidatePath(`/dashboard/organization/${input.organizationId}/grant`);

        return res
    })
}

export async function deleteGrants({
    grantId,
    orgId
}: {
    grantId: string[];
    orgId: string;
}) {
    return handleApiRequest(async () => {

        const res = await db.transaction(async (tx) => {
            await tx.delete(grants).where(inArray(grants.id, grantId));
        });

        revalidatePath(`/dashboard/organization/${orgId}/grant`);

        return res

    })
}

export async function allocateGrant(input: InsertGrantAllocation) {
    return handleApiRequest(async () => {
        const res = await db.transaction(async (tx) => {
            if (input.parentAllocationId) {
                const parentAllocation = await tx.query.grantAllocations.findFirst({
                    where: eq(grantAllocations.id, input.parentAllocationId),
                    columns: {
                        amount: true
                    }
                });

                if (parentAllocation && parentAllocation.amount < input.amount) {
                    throw new Error("Sub-allocation amount is more than the parent allocation amount");
                }
            } else {
                const totalGrantAmount = await tx.query.grants.findFirst({
                    where: eq(grants.id, input.grantId),
                    columns: {
                        totalAmount: true
                    }
                });

                const existingAllocations = await tx.query.grantAllocations.findMany({
                    where: eq(grantAllocations.grantId, input.grantId),
                    columns: {
                        amount: true
                    }
                });

                const totalExistingAllocation = existingAllocations.reduce((sum, allocation) => sum + allocation.amount, 0);

                if (totalGrantAmount && (totalExistingAllocation + input.amount > totalGrantAmount.totalAmount)) {
                    throw new Error("Total allocation (existing + new) exceeds the grant amount");
                }
            }

            const allocate = await tx.insert(grantAllocations).values(input).returning({
                id: grantAllocations.id,
            });
            return allocate;
        });

        revalidatePath(`/dashboard/organization`);

        return res;
    });
}
