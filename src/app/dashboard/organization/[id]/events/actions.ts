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

  console.log(res);
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
  eventType: (typeof eventTypeEnum)["enumValues"][number]; // union of all possible values of the enum
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
