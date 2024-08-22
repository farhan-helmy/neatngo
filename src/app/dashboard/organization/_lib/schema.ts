import { z } from "zod";

export const organizationFormSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, {
      message: "Name is required",
    })
    .max(50, {
      message: "Name must be less than 50 characters",
    }),
  fullName: z
    .string({
      required_error: "Full name is required",
    })
  
    .min(1, {
      message: "Full name is required",
    })
    .max(50, {
      message: "Full name must be less than 50 characters",
    }),
  about: z.string().max(1000, {
    message: "About must be less than 1000 characters",
  }),
});

export type OrganizationFormData = z.infer<typeof organizationFormSchema>;

export const editOrganizationFormSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, {
      message: "Name is required",
    })
    .max(50, {
      message: "Name must be less than 50 characters",
    }),
  fullName: z
    .string({
      required_error: "Full name is required",
    })
    .min(1, {
      message: "Name is required",
    })
    .max(50, {
      message: "Name must be less than 50 characters",
    }),
  about: z.string().max(1000, {
    message: "About must be less than 1000 characters",
  }),
});

export type EditOrganizationFormData = z.infer<
  typeof editOrganizationFormSchema
>;
