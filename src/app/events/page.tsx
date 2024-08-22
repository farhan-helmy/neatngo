import { db } from "@/db";
import { events } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { EventListing } from "./_components/EventsListing";

export default async function EventsPage() {
  const eventData = await db.query.events.findMany({
    where: and(eq(events.isPublished, true), eq(events.isInternalEvent, false)),
    with: {
      organization: true,
    },
  });

  console.log(eventData);
  return (
    <div>
      <div>all events page</div>
      <div>
        {eventData.map((event) => (
            <EventListing key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
