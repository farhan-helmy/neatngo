"use server"

import { db } from "@/db"
import { grantAllocations, grantTransactions, InsertGrantAllocation, InsertTransactions } from "@/db/schema"
import { handleApiRequest } from "@/helper"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function addTransaction(transaction: InsertTransactions) {
    return handleApiRequest(async () => {
        const res = await db.insert(grantTransactions).values(transaction).returning()

        revalidatePath(`/dashboard/organization/${transaction.grantId}/grant/${transaction.grantId}`)
        return res
    })
}

export async function editTransaction({ transaction, transactionId }: { transaction: InsertTransactions, transactionId: string }) {
    return handleApiRequest(async () => {
        const res = await db.update(grantTransactions).set(transaction).where(eq(grantTransactions.id, transactionId)).returning()

        revalidatePath(`/dashboard/organization/${transaction.grantId}/grant/${transaction.grantId}`)
        return res
    })
}

export async function deleteTransaction({ transactionId, grantId }: { transactionId: string, grantId: string }) {
    return handleApiRequest(async () => {
        const res = await db.delete(grantTransactions).where(eq(grantTransactions.id, transactionId)).returning()
        revalidatePath(`/dashboard/organization/${grantId}/grant/${grantId}`)
        return res
    })
}

export async function editAllocation({ allocation, allocationId }: { allocation: InsertGrantAllocation, allocationId: string }) {
    return handleApiRequest(async () => {
        const res = await db.update(grantAllocations).set(allocation).where(eq(grantAllocations.id, allocationId)).returning()
        revalidatePath(`/dashboard/organization`)
        return res
    })
}

export async function deleteAllocation({ allocationId, grantId }: { allocationId: string, grantId: string }) {
    return handleApiRequest(async () => {
        const res = await db.delete(grantAllocations).where(eq(grantAllocations.id, allocationId)).returning()
        revalidatePath(`/dashboard/organization/${grantId}/grant/${grantId}`)
        return res
    })
}