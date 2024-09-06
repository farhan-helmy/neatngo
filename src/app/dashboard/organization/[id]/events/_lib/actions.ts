"use server";

import { db } from "@/db";
import {
  eventRegistrations,
  events,
  eventTypeEnum,
  guestEventRegistrations,
  organizations,
  SelectEvent,
  users,
} from "@/db/schema";
import { handleApiRequest } from "@/helper";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  inArray,
  lte,
  or,
  SQL,
  sql,
} from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { unstable_noStore as noStore } from "next/cache";
import { GetEventsSchema } from "./schema";
import { filterColumn } from "@/lib/filter-column";
import { DrizzleWhere } from "@/types";
import { UpdateEventSchema } from "./validations";

export async function getEvents(input: GetEventsSchema) {
  noStore();
  const {
    page,
    per_page,
    sort,
    name,
    startDate,
    endDate,
    eventType,
    location,
    operator,
    from,
    to,
    orgId,
  } = input;

  try {
    // Offset to paginate the results
    const offset = (page - 1) * per_page;
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof SelectEvent | undefined, "asc" | "desc" | undefined];

    // Convert the date strings to date objects
    const fromDay = from ? sql`to_date(${from}, 'yyyy-mm-dd')` : undefined;
    const toDay = to ? sql`to_date(${to}, 'yyy-mm-dd')` : undefined;
    const eventStartDate = startDate
      ? sql`to_date(${startDate}, 'yyyy-mm-dd')`
      : undefined;
    const eventEndDate = endDate
      ? sql`to_date(${endDate}, 'yyyy-mm-dd')`
      : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      name
        ? filterColumn({
          column: events.name,
          value: name,
        })
        : undefined,
      // Filter by event startDate
      startDate
        ? filterColumn({
          column: events.startDate,
          value: startDate,
        })
        : undefined,
      // Filter by event endDate
      endDate
        ? filterColumn({
          column: events.endDate,
          value: endDate,
        })
        : undefined,
      // Filter by eventType
      eventType
        ? filterColumn({
          column: events.eventType,
          value: eventType,
          isSelectable: true,
        })
        : undefined,
      // Filter by location
      location
        ? filterColumn({
          column: events.location,
          value: location,
        })
        : undefined,
      // Filter by createdAt
      fromDay && toDay
        ? and(gte(events.createdAt, fromDay), lte(users.createdAt, toDay))
        : undefined,
      eq(events.organizationId, orgId!),
    ];

    const where: DrizzleWhere<SelectEvent> =
      !operator || operator === "and"
        ? and(...expressions)
        : or(...expressions);

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(events)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in users
            ? order === "asc"
              ? asc(events[column])
              : desc(events[column])
            : desc(users.id)
        );

      const total = await tx
        .select({
          count: count(),
        })
        .from(events)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0);

      return {
        data,
        total,
      };
    });

    const pageCount = Math.ceil(total / per_page);
    return { data, pageCount };
  } catch (err) {
    return { data: [], pageCount: 0 };
  }
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
  if (endDate < startDate) {
    throw new Error("Event end date cannot be before start date");
  }

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

export async function updateEvent(
  input: UpdateEventSchema & { id: string; orgId: string }
) {
  noStore();
  return handleApiRequest(async () => {
    try {
      const startDate = new Date(input.startDate!);
      const endDate = new Date(input.endDate!);

      if (endDate < startDate) {
        throw new Error("Event end date cannot be before start date");
      }

      const res = await db.transaction(async (tx) => {
        const updatedEvent = await tx
          .update(events)
          .set({
            name: input.name,
            description: input.description,
            eventType: input.eventType,
            isInternalEvent: input.isInternalEvent,
            startDate,
            endDate,
            location: input.location,
            maxAttendees: input.maxAttendees,
          })
          .where(eq(events.id, input.id))
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

export async function deleteEvent({
  eventId,
  orgId,
}: {
  eventId: string[];
  orgId: string;
}) {
  return handleApiRequest(async () => {

    const res = await db.transaction(async (tx) => {
      await tx.delete(events).where(inArray(events.id, eventId));
    });

    revalidatePath(`/dashboard/organization/${orgId}/events`);

    return res;

  });
}

export async function toggleEventPublishStatus({
  eventId,
  isPublished,
}: {
  eventId: string;
  isPublished: boolean;
}) {
  noStore();
  return handleApiRequest(async () => {
    try {
      const res = await db.transaction(async (tx) => {
        const updatedEvent = await tx
          .update(events)
          .set({
            isPublished,
          })
          .where(eq(events.id, eventId))
          .returning({
            id: events.id,
            isPublished: events.isPublished,
          });

        if (!updatedEvent.length) {
          throw new Error("Event not found or update failed");
        }

        return updatedEvent[0];
      });

      revalidatePath(`/dashboard/organization`);

      return res;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  });
}

export async function saveDescription({
  description,
  eventId,
}: {
  description: string;
  eventId: string;
}) {
  return handleApiRequest(async () => {
    const res = await db.transaction(async (tx) => {
      const updatedEvent = await tx
        .update(events)
        .set({
          description,
        })
        .where(eq(events.id, eventId))
        .returning({
          id: events.id,
          description: events.description,
        });

      if (!updatedEvent.length) {
        throw new Error("Event not found or update failed");
      }

      return updatedEvent[0];
    });

    revalidatePath(`/dashboard/organization`);

    return res;
  });
}

export async function markAttendance({
  eventId,
  participantId,
  attended,
  orgId,
  isGuest,
}: {
  eventId: string;
  participantId: string;
  attended: boolean;
  orgId: string;
  isGuest: boolean;
}) {
  noStore();
  return handleApiRequest(async () => {
    console.log("data====>",eventId, participantId, attended, isGuest);
    const res = await db.transaction(async (tx) => {
      if (isGuest) {
        const updatedGuestRegistration = await tx.update(guestEventRegistrations).set({
          attended,
        })
        .where(and(eq(guestEventRegistrations.eventId, eventId), eq(guestEventRegistrations.guestId, participantId)))
        .returning({
          id: guestEventRegistrations.id,
          attended: guestEventRegistrations.attended,
        });

        if (!updatedGuestRegistration.length) {
          throw new Error("Guest registration not found or update failed");
        }

        return updatedGuestRegistration[0];
      } else {
        const updatedRegistration = await tx.update(eventRegistrations).set({
          attended,
        })
        .where(and(eq(eventRegistrations.eventId, eventId), eq(eventRegistrations.userId, participantId)))
        .returning({
          id: eventRegistrations.id,
          attended: eventRegistrations.attended,
        });

        if (!updatedRegistration.length) {
          throw new Error("Registration not found or update failed");
        }

        return updatedRegistration[0];
      }
    });

    console.log(participantId, attended, eventId, isGuest);

    revalidatePath(`/dashboard/organization/${orgId}/events/${eventId}`);

    return res;
  });
}
