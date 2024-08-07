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

export function MembersTable() {
  return (
    <Table>
      <TableCaption>A list of your ngo members.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Full Name</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">farhan@ngomms.com</TableCell>
          <TableCell>Muhd farhan</TableCell>
          <TableCell>
            <div className="flex gap-1 items-center justify-center">
              <Button variant="ghost">
                <EyeIcon size={20} />
              </Button>
              <Button variant="ghost">
                <Trash2 size={20} />
              </Button>
              <Button variant="ghost">
                <Edit2 size={20} />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
