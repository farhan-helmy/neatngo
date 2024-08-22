import { z } from "zod";

export const updateOrganizationSchema = z.object({
  name: z.string().optional(),
  fullName: z.string().optional(),
  about: z.string().optional(),
});

export type updateOrganizationSchema = z.infer<typeof updateOrganizationSchema>;
