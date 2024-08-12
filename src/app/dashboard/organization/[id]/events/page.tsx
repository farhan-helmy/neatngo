import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import { EventsTable } from "./EventsTable";
import { getEvents } from "./actions";
import { AddEventForm } from "./AddEventForm";

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const events = await getEvents({ organizationId: params.id });

  if (!events) {
    return <div>loading...</div>;
  }
  return (
    <Layout>
      <LayoutHeader className="flex justify-between">
        Events
        <AddEventForm />
      </LayoutHeader>
      <LayoutBody>
        <EventsTable
          events={events.map((event) => ({
            id: event.id || "",
            name: event.name || "",
            startDate: event.startDate || "",
            endDate: event.endDate || "",
          }))}
          organizationId={params.id}
        />
      </LayoutBody>
    </Layout>
  );
}
