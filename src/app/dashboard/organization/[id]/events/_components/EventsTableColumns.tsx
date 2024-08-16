"use client";

import * as React from "react";
import {
  events,
  users,
  UserWithMemberships,
  type SelectUsers,
} from "@/db/schema";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
// import { UpdateMemberSheet } from "./UpdateMemberSheet";
import { EventResults } from "../_lib/type";
import { formatEventType, getEventTypeIcon } from "../_lib/utils";
import { MapPinIcon, MapPinnedIcon, MapPinOffIcon } from "lucide-react";
import { UpdateEventSheet } from "./EditEventSheet";
import { DeleteEventDialog } from "./DeleteEventDialog";

// import { updateTask } from "../_lib/actions";
// import { getPriorityIcon, getStatusIcon } from "../_lib/utils";
// import { DeleteTasksDialog } from "./delete-tasks-dialog";
// import { UpdateTaskSheet } from "./update-task-sheet";

export function getColumns(): ColumnDef<EventResults>[] {
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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "location",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Location" />
      ),
      cell: ({ row }) => (
        <div className="flex w-[6.25rem] items-center">
          <MapPinnedIcon
            className="mr-2 size-4 text-muted-foreground"
            aria-hidden="true"
          />
          {row.getValue("location")}
        </div>
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "eventType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Event Type" />
      ),
      cell: ({ row }) => {
        const eventType = events.eventType.enumValues.find(
          (eventType) => eventType === row.getValue("eventType")
        );

        if (!eventType) {
          return null;
        }

        const Icon = getEventTypeIcon(eventType);

        return (
          <div className="flex w-[6.25rem] items-center">
            <Icon
              className="mr-2 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span>{formatEventType(eventType)}</span>
          </div>
        );
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Start Date" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "endDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="End Date" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [showUpdateUserSheet, setShowEditEventSheet] =
          React.useState(false);
        const [showDeleteEventDialog, setShowDeleteEventDialog] =
          React.useState(false);

        return (
          <>
            <UpdateEventSheet
              event={row.original}
              open={showUpdateUserSheet}
              onOpenChange={setShowEditEventSheet}
            />
            <DeleteEventDialog
              events={[row.original]}
              showTrigger={false}
              onSuccess={() => {}}
              open={showDeleteEventDialog}
              onOpenChange={setShowDeleteEventDialog}
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
                <DropdownMenuItem onSelect={() => setShowEditEventSheet(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setShowDeleteEventDialog(true)}
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
