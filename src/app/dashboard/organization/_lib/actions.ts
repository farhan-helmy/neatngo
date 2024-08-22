"use server";

import { db } from "@/db";
import { organizations } from "@/db/schema";
import { handleApiRequest } from "@/helper";
import { eq } from "drizzle-orm";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { updateOrganizationSchema } from "./validations";
import { z } from "zod";

const GetOrganizationSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  fullName: z.string().optional(),
  about: z.string().optional(),
});

export type GetOrganizationInput = z.infer<typeof GetOrganizationSchema>;

export async function getOrganization(input: GetOrganizationInput) {
  const { id } = GetOrganizationSchema.parse(input);

  const data = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      fullName: organizations.fullName,
      about: organizations.about,
    })
    .from(organizations)
    .where(eq(organizations.id, id))
    .execute();

  return data[0];
}

export async function updateOrganization(
  input: updateOrganizationSchema & { id: string }
) {
  noStore();

  return handleApiRequest(async () => {
    try {
      const res = await db.transaction(async (tx) => {
        const updatedOrganization = await tx
          .update(organizations)
          .set({
            name: input.name,
            fullName: input.fullName,
            about: input.about,
          })
          .where(eq(organizations.id, input.id))
          .returning({
            id: organizations.id,
            name: organizations.name,
            fullName: organizations.fullName,
            about: organizations.about,
          });

        if (!updatedOrganization.length) {
          throw new Error("Organization not found or update failed");
        }

        return updatedOrganization[0];
      });

      revalidatePath(`/dashboard/organization/${res.id}/edit`);

      return res;
    } catch (error) {
      console.error("Error updating organization: ", error);
      throw error;
    }
  });
}

export async function deleteEvent() {}
