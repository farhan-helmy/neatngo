
"use server";
import { db } from "@/db";
import { events, eventTypeEnum } from "@/db/schema";
import { handleApiRequest } from "@/helper";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateEvent({
    eventId,
    name,
    description,
    eventType,
    startDate,
    endDate,
    location,
    maxAttendees,
}: {
    eventId: string;
    name: string;
    description: string;
    eventType: (typeof eventTypeEnum)["enumValues"][number];
    startDate: Date;
    endDate: Date;
    location: string;
    maxAttendees: number;
}) {
    return handleApiRequest(async () => {
        try {
            const res = await db.transaction(async (tx) => {
                const updatedEvent = await tx
                    .update(events)
                    .set({
                        name,
                        description,
                        eventType,
                        startDate,
                        endDate,
                        location,
                        maxAttendees,
                    })
                    .where(eq(events.id, eventId))
                    .returning({
                        id: events.id,
                        name: events.name,
                        organizationId: events.organizationId,
                    });

                if (!updatedEvent.length) {
                    throw new Error("Event not found or update failed");
                }

                return updatedEvent[0];
            });

            revalidatePath(`/dashboard/organization/${res.organizationId}/events`);

            return res;
        } catch (error) {
            console.error("Error updating event:", error);
            throw error;
        }
    });
}

