"use client";
"use memo";

import * as React from "react";
import { type SelectUsers } from "@/db/schema";
import { type DataTableFilterField } from "@/types";

import { useDataTable } from "@/hooks/useDataTable";
import { DataTableAdvancedToolbar } from "@/components/data-table/advanced/data-table-advanced-toolbar";
import { DataTable } from "@/components/data-table/data-table";

import { getColumns } from "./MembersTableColumns";

import { getMembers } from "../_lib/actions";
import { MembersTableToolbarActions } from "./MembersTableToolbarActions";

interface MembersTableProps {
  membersPromise: ReturnType<typeof getMembers>;
}

export function MembersTable({ membersPromise }: MembersTableProps) {
  const { data, pageCount } = React.use(membersPromise);

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
  const filterFields: DataTableFilterField<SelectUsers>[] = [
    {
      label: "Email",
      value: "email",
      placeholder: "Filter email...",
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
        <MembersTableToolbarActions table={table} />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
}
