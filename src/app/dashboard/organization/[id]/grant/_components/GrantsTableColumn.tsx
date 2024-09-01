"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { GrantResults } from "../_lib/type";
import { DeleteGrantDialog } from "./DeleteGrantDialog";
import Link from "next/link";
import { Edit, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AllocateGrantDialog } from "./AllocateGrantDialog";

export const getColumns = (): ColumnDef<GrantResults>[] => [
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
        accessorKey: "totalAmount",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => <div>RM {(row.getValue("totalAmount") as number).toLocaleString('en-MY', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>,
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "startDate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Start Date" />
        ),
        cell: ({ row }) => {
            const startDate = row.getValue("startDate") as string;
            const formattedDate = new Date(startDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            return <div>{formattedDate}</div>;
        },
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "endDate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="End Date" />
        ),
        cell: ({ row }) => {
            const endDate = row.getValue("endDate") as string;
            const formattedDate = new Date(endDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            return <div>{formattedDate}</div>;
        },
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const isActive = status === "ACTIVE";

            const handleStatusChange = (checked: boolean) => {
                // Here you would typically update the status in your backend
                // For now, we'll just show a toast
                toast.success(`Grant status changed to ${checked ? "Active" : "Inactive"}`);
            };

            return (
                <div className="flex flex-col items-start space-y-2">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id={`active-switch-${row.id}`}
                            checked={isActive}
                            onCheckedChange={handleStatusChange}
                        />
                        <Label htmlFor={`active-switch-${row.id}`} className="font-medium">
                            {isActive ? "Active" : "Inactive"}
                        </Label>
                    </div>
                </div>
            );
        },
        enableSorting: true,
        enableHiding: true,
    },
    {
        id: "actions",
        cell: function Cell({ row }) {
            const [showGrantEditSheet, setShowGrantEditSheet] =
                React.useState(false);
            const [showDeleteGrantDialog, setShowDeleteGrantDialog] =
                React.useState(false);
            const [showAllocateGrantDialog, setShowAllocateGrantDialog] =
                React.useState(false);

            return (
                <>
                    {/* <UpdateEventSheet
            event={row.original}
            open={showUpdateUserSheet}
            onOpenChange={setShowEditEventSheet}
          /> */}
                    <DeleteGrantDialog
                        grants={[row.original]}
                        showTrigger={false}
                        onSuccess={() => { }}
                        open={showDeleteGrantDialog}
                        onOpenChange={setShowDeleteGrantDialog}
                    />
                    <AllocateGrantDialog
                        open={showAllocateGrantDialog}
                        onOpenChange={setShowAllocateGrantDialog}
                        grantId={row.original.id}
                    />
                    <div className="flex items-center space-x-2">
                        <Link href={`/dashboard/organization/${row.original.organizationId}/grant/${row.original.id}`}>
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
                            onClick={() => setShowGrantEditSheet(true)}
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
                                    onClick={() => setShowAllocateGrantDialog(true)}
                                >
                                    Allocate Grant
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setShowDeleteGrantDialog(true)}>
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
