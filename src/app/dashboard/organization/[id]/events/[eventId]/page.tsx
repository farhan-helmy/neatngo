import { db } from "@/db";
import { eventRegistrations, events } from "@/db/schema";
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

  const attendeesForProps = attendees.map(attendee => ({
    ...attendee,
    registrationDate: attendee.registrationDate.toISOString(),
    attended: attendee.attended ?? false, // Ensure attended is always boolean
  }));

  const participants = attendees.map(attendee => ({
    id: attendee.userId,
    email: attendee.user.email,
    attended: attendee.attended ?? false
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
        attendees={attendeesForProps}
        participants={participants}
        organizationId={params.id}
      />
    </Layout>
  );
}