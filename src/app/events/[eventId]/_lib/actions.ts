"use server";
import { db } from "@/db";
import { eventRegistrations, events, guestEventRegistrations } from "@/db/schema";
import { handleApiRequest } from "@/helper";
import { and, eq } from "drizzle-orm";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export async function checkUserRSVPd({ eventId, userId }: { eventId: string, userId: string }) {
  return handleApiRequest(async () => {
    const registration = await db.query.eventRegistrations.findFirst({
      where: and(
        eq(eventRegistrations.eventId, eventId),
        eq(eventRegistrations.userId, userId)
      ),
    });

    return registration !== undefined;
  });
}

export async function getEvent({ eventId }: { eventId: string }) {
  return handleApiRequest(async () => {
    const eventData = await db.transaction(async (tx) => {
      const event = await tx.query.events.findFirst({
        where: and(
          eq(events.id, eventId),
          eq(events.isPublished, true),
          eq(events.isInternalEvent, false)
        ),
        with: {
          organization: true,
        },
      });

      const registrations = await tx.query.eventRegistrations.findMany({
        where: eq(eventRegistrations.eventId, eventId),
        with: {
          user: true,
        },
      });

      const guestRegistrations = await tx.query.guestEventRegistrations.findMany({
        where: eq(guestEventRegistrations.eventId, eventId),
      });

      return { event, registrations, guestRegistrations };
    });
    return eventData;
  });
}

export async function registerUserForEvent({ eventId, userId }: { eventId: string, userId: string }) {
  noStore();
  return handleApiRequest(async () => {
    const registerEventResult = await db.transaction(async (tx) => {
      // Check if user has already registered
      const existingRegistration = await tx.query.eventRegistrations.findFirst({
        where: and(
          eq(eventRegistrations.eventId, eventId),
          eq(eventRegistrations.userId, userId)
        ),
      });

      if (existingRegistration) {
        throw new Error("User has already registered for this event");
      }

      // Get event details and check participant limit
      const event = await tx.query.events.findFirst({
        where: eq(events.id, eventId),
      });

      if (!event) {
        throw new Error("Event not found");
      }

      if (event.maxAttendees !== null) {
        const currentRegistrations = await tx.query.eventRegistrations.findMany({
          where: eq(eventRegistrations.eventId, eventId),
        });

        if (currentRegistrations.length >= event.maxAttendees) {
          throw new Error("Event has reached maximum number of participants");
        }
      }

      // Register user for the event
      return await tx.insert(eventRegistrations).values({
        eventId,
        userId,
      });
    });

    revalidatePath(`/events/${eventId}`);
    return registerEventResult;
  });
}

export async function cancelUserRSVP({ eventId, userId }: { eventId: string, userId: string }) {
  noStore();
  return handleApiRequest(async () => {
    const cancelEventResult = await db.delete(eventRegistrations).where(and(
      eq(eventRegistrations.eventId, eventId),
      eq(eventRegistrations.userId, userId)
    ));
    revalidatePath(`/events/${eventId}`);
    return cancelEventResult;
  });
}
