import { db } from "@/db";
import { events } from "@/db/schema";
import { and, eq } from "drizzle-orm";


export default async function EventsPage() {
  const eventData = await db.query.events.findMany({
    where: and(eq(events.isPublished, true), eq(events.isInternalEvent, false)),
    with: {
      organization: true,
    },
  });

  return (
    <div>
      <div>all events page</div>
      <div>
        {/* {eventData.map((event) => (
            <EventListing />
        ))} */}
      </div>
    </div>
  );
}
