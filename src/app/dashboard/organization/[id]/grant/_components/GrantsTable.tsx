"use client";
"use memo";

import * as React from "react";
import { SelectGrant } from "@/db/schema";
import { type DataTableFilterField } from "@/types";

import { useDataTable } from "@/hooks/useDataTable";
import { DataTableAdvancedToolbar } from "@/components/data-table/advanced/data-table-advanced-toolbar";
import { DataTable } from "@/components/data-table/data-table";

import { getColumns } from "./GrantsTableColumn";

import { getGrants } from "../_lib/actions";
import { GrantsTableToolbarActions } from "./GrantsTableToolbarActions";

interface GrantsTableProps {
    grantsPromise: ReturnType<typeof getGrants>;
}

export function GrantsTable({ grantsPromise }: GrantsTableProps) {
    const { data, pageCount } = React.use(grantsPromise);

    const columns = React.useMemo(() => getColumns(), []);

    const filterFields: DataTableFilterField<SelectGrant>[] = [
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
            label: "Status",
            value: "status",
            placeholder: "Filter status...",
        },
    ];

    const { table } = useDataTable({
        data,
        columns,
        pageCount,
        filterFields,
        enableAdvancedFilter: true,
        initialState: {
            sorting: [{ id: "createdAt", desc: true }],
            columnPinning: { right: ["actions"] },
        },
        getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    });

    return (
        <DataTable table={table}>
            <DataTableAdvancedToolbar table={table} filterFields={filterFields}>
                <GrantsTableToolbarActions table={table} />
            </DataTableAdvancedToolbar>
        </DataTable>
    );
}