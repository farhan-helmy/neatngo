"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { UserData } from "./types";
import { Badge } from "@/components/ui/badge";
import { CopyIcon } from "@radix-ui/react-icons";

export const columns: ColumnDef<UserData>[] = [
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original.name;

      return <div className="max-w-24 truncate">{name}</div>;
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.original.phone;

      return (
        <div className="flex flex-row gap-1 items-center">
          <Badge variant={"default"}>{phone}</Badge>
          <CopyIcon
            className="h-4 w-4 cursor-pointer"
            onClick={() => navigator.clipboard.writeText(phone!)}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "isPaid",
    header: "Status",
    cell: ({ row }) => {
      const paid = row.original.isPaid;

      return (
        <Badge className={`${paid ? "bg-green-500" : "bg-red-500"}`}>
          {paid ? "Paid" : "Unpaid"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "membershipStart",
    header: "Member Start",
    cell: ({ row }) => {
      const start = row.original.membershipStart;

      return <Badge variant={"secondary"}>{start}</Badge>;
    },
  },
  {
    accessorKey: "membershipExpiry",
    header: "Member End",
    cell: ({ row }) => {
      const expiry = row.original.membershipExpiry;

      return <Badge variant={"secondary"}>{expiry}</Badge>;
    },
  },
  {
    accessorKey: "nameOfDisorder",
    header: "Disease",
    cell: ({ row }) => {
      const disease = row.original.nameOfDisorder;

      return <Badge variant={"outline"}>{disease}</Badge>;
    },
  },
  // {
  //   accessorKey: "email",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Email
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
