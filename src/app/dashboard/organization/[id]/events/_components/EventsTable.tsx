"use client";
"use memo";

import * as React from "react";
import { SelectEvent } from "@/db/schema";
import { type DataTableFilterField } from "@/types";

import { useDataTable } from "@/hooks/useDataTable";
import { DataTableAdvancedToolbar } from "@/components/data-table/advanced/data-table-advanced-toolbar";
import { DataTable } from "@/components/data-table/data-table";

import { getColumns } from "./EventsTableColumns";

import { getEvents } from "../_lib/actions";
import { EventsTableToolbarActions } from "./EventsTableToolbarActions";

interface EventsTableProps {
  eventsPromise: ReturnType<typeof getEvents>;
}

export function EventsTable({ eventsPromise }: EventsTableProps) {
  const { data, pageCount } = React.use(eventsPromise);

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), []);

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */
  const filterFields: DataTableFilterField<SelectEvent>[] = [
    {
      label: "Name",
      value: "name",
      placeholder: "Filter name...",
    },
    {
      label: "Start Date",
      value: "startDate",
      placeholder: "Filter start date...",
    },
    {
      label: "End Date",
      value: "endDate",
      placeholder: "Filter end date...",
    },
    {
      label: "Event Type",
      value: "eventType",
      placeholder: "Filter event type...",
    },
    {
      label: "Location",
      value: "location",
      placeholder: "Filter location...",
    },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    /* optional props */
    filterFields,
    enableAdvancedFilter: true,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    // For remembering the previous row selection on page change
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    /* */
  });

  return (
    <DataTable table={table}>
      <DataTableAdvancedToolbar table={table} filterFields={filterFields}>
        <EventsTableToolbarActions table={table} />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
}
