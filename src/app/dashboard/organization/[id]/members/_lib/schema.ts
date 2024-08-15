import { z } from "zod"

export const searchParamsSchema = z.object({
    page: z.coerce.number().default(1),
    per_page: z.coerce.number().default(10),
    sort: z.string().optional(),
    email: z.string().optional(),
    priority: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    operator: z.enum(["and", "or"]).optional(),
    orgId: z.string().optional(),
})

export const getMembersSchema = searchParamsSchema

export type GetMembersSchema = z.infer<typeof getMembersSchema>