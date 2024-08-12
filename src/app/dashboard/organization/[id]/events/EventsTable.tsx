"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, EyeIcon, Trash2 } from "lucide-react";
import Link from "next/link";

export function EventsTable({
  events,
  organizationId,
}: {
  events: { id: string; name: string; startDate: Date; endDate: Date }[];
  organizationId: string;
}) {
  return (
    <Table>
      <TableCaption>A list of your events.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>

          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="font-medium">{event.name}</TableCell>
            <TableCell>{event.startDate.toDateString()}</TableCell>
            <TableCell>{event.endDate.toDateString()}</TableCell>
            <TableCell>
              <div className="flex gap-1 items-center justify-center">
                <Link
                  href={`/dashboard/organization/${organizationId}/events/${event.id}`}
                >
                  <Button variant="ghost">
                    <EyeIcon size={20} />
                  </Button>
                </Link>
                <Link
                  href={`/dashboard/organization/${organizationId}/events/${event.id}/edit`}
                >
                  <Button variant="ghost">
                    <Edit2 size={20} />
                  </Button>
                </Link>
                <Button variant="ghost">
                  <Trash2 size={20} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
