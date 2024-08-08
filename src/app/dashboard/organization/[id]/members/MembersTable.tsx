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

export function MembersTable({
  members,
  organizationId,
}: {
  members: { id: string; name: string; email: string; phone: string }[];
  organizationId: string;
}) {
  return (
    <Table>
      <TableCaption>A list of your ngo members.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Full Name</TableHead>
          <TableHead>Phone</TableHead>

          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-medium">{member.email}</TableCell>
            <TableCell>{member.name}</TableCell>
            <TableCell>{member.phone}</TableCell>
            <TableCell>
              <div className="flex gap-1 items-center justify-center">
                <Link
                  href={`/dashboard/organization/${organizationId}/members/${member.id}`}
                >
                  <Button variant="ghost">
                    <EyeIcon size={20} />
                  </Button>
                </Link>

                <Button variant="ghost">
                  <Trash2 size={20} />
                </Button>
                <Button variant="ghost">
                  <Edit2 size={20} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
