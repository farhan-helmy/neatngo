import { db } from "@/db";
import { eventRegistrations, events, guestEventRegistrations } from "@/db/schema";
import { eq } from "drizzle-orm";

import { Layout } from "@/components/custom/layout";
import { UpdateEventSheet } from "../_components/EditEventSheet";
import { ViewEventPage } from "../_components/ViewEventPage";

export default async function ViewEventPageWrapper({
  params,
  searchParams,
}: {
  params: { id: string; eventId: string };
  searchParams: { action?: "edit" };
}) {
  const event = await db.query.events.findFirst({
    where: eq(events.id, params.eventId),
    with: {
      organization: true,
    },
  });

  if (!event) {
    return <div>Event not found</div>;
  }

  const attendees = await db.query.eventRegistrations.findMany({
    where: eq(eventRegistrations.eventId, params.eventId),
    with: {
      user: true,
    },
  });

  const guestAttendees = await db.query.guestEventRegistrations.findMany({
    where: eq(guestEventRegistrations.eventId, params.eventId),
    with: {
      guest: true,
    }
  });

  const allAttendees = [
    ...attendees.map(attendee => ({
      ...attendee,
      id: attendee.userId,
      registrationDate: attendee.registrationDate.toISOString(),
      attended: attendee.attended ?? false,
      isGuest: false,
    })),
    ...guestAttendees.map(guest => ({
      ...guest,
      id: guest.guestId,
      registrationDate: guest.registrationDate.toISOString(),
      attended: guest.attended ?? false,
      isGuest: true,
      user: { email: guest.guest.email, firstName: guest.guest.name },
    })),
  ];

  const participants = allAttendees.map(attendee => ({
    id: attendee.id,
    email: attendee.user.email,
    firstName: attendee.user.firstName,
    attended: attendee.attended,
    isGuest: attendee.isGuest,
  }));

  const eventForProps = {
    ...event,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate.toISOString(),
  };

  return (
    <Layout>
      <UpdateEventSheet event={event} open={searchParams.action === "edit"} isServer={true} />
      <ViewEventPage
        event={eventForProps}
        attendees={allAttendees}
        participants={participants}
        organizationId={params.id}
      />
    </Layout>
  );
}