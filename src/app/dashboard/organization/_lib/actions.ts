import { db } from "@/db";
import { organizations } from "@/db/schema";
import { handleApiRequest } from "@/helper";

export async function getOrganizations() {
  try {
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

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return { data: null, error: "Failed to fetch organizations" };
  }
}

export async function updateOrganization() {}

export async function deleteEvent() {}
