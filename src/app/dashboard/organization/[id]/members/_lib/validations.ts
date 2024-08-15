import { z } from "zod";

export const updateUserSchema = z.object({
    email: z.string().email(),
    phone: z.string().optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;