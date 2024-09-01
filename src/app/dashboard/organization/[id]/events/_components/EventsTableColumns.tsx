"use client";

import * as React from "react";
import {
  events,
} from "@/db/schema";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { EventResults } from "../_lib/type";
import { formatEventType, getEventTypeIcon } from "../_lib/utils";
import { MapPinIcon, MapPinnedIcon, MapPinOffIcon, Eye, Edit } from "lucide-react";
import { UpdateEventSheet } from "./EditEventSheet";
import { DeleteEventDialog } from "./DeleteEventDialog";
import { Switch } from "@/components/ui/switch";
import { toggleEventPublishStatus } from "../_lib/actions";
import Link from "next/link";

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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="grid grid-cols-3 w-24 items-center">
                <MapPinnedIcon
                  className="mr-2 h-4 w-4 text-muted-foreground"
                />
                <div className="truncate col-span-2">{row.getValue("location")}</div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{row.getValue("location")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
      enableHiding: false,
    },
    {
      accessorKey: "isPublished",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Publish" />
      ),
      cell: ({ row }) => (
        <Switch
          checked={row.getValue("isPublished")}
          onCheckedChange={async (value) => {
            const res = await toggleEventPublishStatus({
              eventId: row.original.id,
              isPublished: value,
            });

            if (res.error) {
              toast.error(res.error);
              return;
            }
            toast.success(`Event ${value ? "published" : "unpublished"}`);
          }}
        />
      ),
      enableSorting: false,
      enableHiding: false,
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
              onSuccess={() => { }}
              open={showDeleteEventDialog}
              onOpenChange={setShowDeleteEventDialog}
            />
            <div className="flex items-center space-x-2">
              <Link href={`/dashboard/organization/${row.original.organizationId}/events/${row.original.id}`}>
                <Button
                  variant="ghost"
                  size="icon"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEditEventSheet(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label="More options"
                    variant="ghost"
                    size="icon"
                  >
                    <DotsHorizontalIcon className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={() => {
                      navigator.clipboard.writeText(
                        `${process.env.NEXT_PUBLIC_ENVIRONMENT === "dev"
                          ? "https://demo.neatngo.com/events/"
                          : "https://neatngo.com/events/"
                        }${row.original.id}`
                      );
                      toast.success("Event link copied to clipboard");
                    }}
                  >
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setShowDeleteEventDialog(true)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        );
      },
    },
  ];
}
