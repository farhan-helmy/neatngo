import { z } from "zod";

export const searchParamsSchema = z.object({
    page: z.coerce.number().default(1),
    per_page: z.coerce.number().default(10),
    sort: z.string().optional(),
    name: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    category: z.string().optional(),  
    totalAmount: z.number().optional(),
    operator: z.enum(["and", "or"]).optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    orgId: z.string().optional(),
})

export const getGrantsSchema = searchParamsSchema

export type GetGrantsSchema = z.infer<typeof getGrantsSchema>

export const addGrantSchema = z.object({
    name: z.string(),
    description: z.string(),
    totalAmount: z.string(),
    startDate: z.date(),
    endDate: z.date(),
})

export const allocateGrantSchema = z.object({
    name: z.string(),
    amount: z.string(),
})