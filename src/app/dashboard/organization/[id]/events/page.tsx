import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import { getEvents } from "./_lib/actions";
import { searchParamsSchema } from "./_lib/schema";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { EventsTable } from "./_components/EventsTable";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export default async function EventPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search = searchParamsSchema.parse(searchParams);
  const eventsPromise = getEvents({ ...search, orgId: params.id });

  return (
    <Layout>
      <LayoutHeader className="flex justify-between">Events</LayoutHeader>
      <LayoutBody>
        <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
          <DateRangePicker
            triggerSize="sm"
            triggerClassName="ml-auto w-56 sm:w-60"
            align="end"
          />
        </React.Suspense>
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
              shrinkZero
            />
          }
        ></React.Suspense>

        <EventsTable eventsPromise={eventsPromise} />
      </LayoutBody>
    </Layout>
  );
}
