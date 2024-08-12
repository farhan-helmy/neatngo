import { db } from "@/db";
import { EditEventForm } from "./EditEventForm";
import { eq } from "drizzle-orm";
import { events } from "@/db/schema";

export default async function EditEventPage({
  params,
}: {
  params: { id: string; eventId: string };
}) {
  const event = await db.query.events.findFirst({
    where: eq(events.id, params.eventId),
  });

  if (!event) {
    return <div>Event not found</div>;
  }
  return <EditEventForm event={event} />;
}
