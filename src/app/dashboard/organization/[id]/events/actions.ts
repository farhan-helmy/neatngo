"use server";

import { db } from "@/db";
import { events, eventTypeEnum, organizations, users } from "@/db/schema";
import { handleApiRequest } from "@/helper";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getEvents({
  organizationId,
}: {
  organizationId: string;
}) {
  const res = await db
    .select({
      id: events.id,
      name: events.name,
      startDate: events.startDate,
      endDate: events.endDate,
      location: events.location,
      organizationId: events.organizationId,
    })
    .from(events)
    .where(eq(events.organizationId, organizationId));

  return res;
}

export async function addEvent({
  organizationId,
  name,
  description,
  eventType,
  startDate,
  endDate,
  location,
  maxAttendees,
}: {
  organizationId: string;
  name: string;
  description: string;
  eventType: (typeof eventTypeEnum)["enumValues"][number]; 
  startDate: Date;
  endDate: Date;
  location: string;
  maxAttendees: number;
}) {
  return handleApiRequest(async () => {
    const res = await db.transaction(async (tx) => {
      const event = await tx
        .insert(events)
        .values({
          organizationId,
          name,
          description,
          eventType,
          startDate,
          endDate,
          location,
          maxAttendees,
        })
        .returning({
          organizationId: events.organizationId,
        });

      return event;
    });

    revalidatePath("/");
    return res;
  });
}

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

