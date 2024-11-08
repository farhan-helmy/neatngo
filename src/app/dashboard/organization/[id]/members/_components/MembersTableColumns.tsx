"use client";

import * as React from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { UpdateMemberSheet } from "./EditMemberSheet";
import { UserResult } from "../_lib/type";
import { DeleteMemberDialog } from "./DeleteMemberDialog";
import { Switch } from "@/components/ui/switch";
import { toggleMembershipStatus } from "../_lib/actions";

export function getColumns(): ColumnDef<UserResult>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },
    {
      accessorKey: "isActive",
      header: () => <div>Status</div>,
      cell: ({ row }) => (
        <Switch
          checked={row.getValue("isActive")}
          onCheckedChange={async (value) => {
            const res = await toggleMembershipStatus({
              membershipId: row.original.membershipId!,
              isActive: value,
            });

            if (res.error) {
              toast.error(res.error);
              return;
            }
            toast.success(`Member ${value ? "activated" : "deactivated"}`);
          }}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [showUpdateUserSheet, setShowUpdateUserSheet] =
          React.useState(false);
        const [showDeleteMemberDialog, setShowDeleteMemberDialog] =
          React.useState(false);

        return (
          <>
            <UpdateMemberSheet
              user={row.original}
              open={showUpdateUserSheet}
              onOpenChange={setShowUpdateUserSheet}
            />
            <DeleteMemberDialog
              users={[row.original]}
              open={showDeleteMemberDialog}
              onOpenChange={setShowDeleteMemberDialog}
              onSuccess={() => {
                row.toggleSelected(false);
              }}
              showTrigger={false}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onSelect={() => setShowUpdateUserSheet(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setShowDeleteMemberDialog(true)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
      size: 40,
    },
  ];
}
