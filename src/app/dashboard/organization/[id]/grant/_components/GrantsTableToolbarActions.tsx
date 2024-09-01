"use client";

import { DownloadIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { exportTableToCSV } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { GrantResults } from "../_lib/type";
import { DeleteGrantDialog } from "./DeleteGrantDialog";
import { AddGrantForm } from "./AddGrantForm";

interface GrantsTableToolbarActionsProps {
    table: Table<GrantResults>;
}

export function GrantsTableToolbarActions({
    table,
}: GrantsTableToolbarActionsProps) {
    return (
        <div className="flex items-center gap-2">
            {table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <DeleteGrantDialog
                    grants={table
                        .getFilteredSelectedRowModel()
                        .rows.map((row) => row.original)}
                    onSuccess={() => table.toggleAllRowsSelected(false)}
                />
            ) : null}
            <AddGrantForm />
            <Button
                variant="outline"
                size="sm"
                onClick={() =>
                    exportTableToCSV(table, {
                        filename: "grants",
                        excludeColumns: ["select", "actions"],
                    })
                }
            >
                <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
                Export
            </Button>
            {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
        </div>
    );
}