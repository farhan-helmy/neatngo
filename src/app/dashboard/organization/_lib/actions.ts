import { db } from "@/db";
import { organizations } from "@/db/schema";
import { handleApiRequest } from "@/helper";

export async function getOrganizations() {
return handleApiRequest(async () => {
    const data = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        isPublic: organizations.isPublic,
        createdAt: organizations.createdAt,
        updatedAt: organizations.updatedAt,
      })
      .from(organizations)
      .execute();

    return data;
  });
}

export async function updateOrganization() {}

export async function deleteEvent() {}
