import { db } from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function EventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const event = await db.query.events.findFirst({
    where: eq(events.id, params.eventId),
  });

  console.log(event);
  return (
    <div>
      <div>event page</div>
    </div>
  );
}
