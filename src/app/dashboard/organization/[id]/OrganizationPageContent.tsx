"use client";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  CalendarDaysIcon,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MembershipsWithUser,
  SelectMemberships,
  SelectUsers,
} from "@/db/schema";
import { formatDate } from "@/helper";
import { useParams } from "next/navigation";

export function OrganizationPageContent({
  members,
}: {
  members: MembershipsWithUser[];
}) {
  const params = useParams();
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Org Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{members.length}</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Recent members</CardTitle>
                <CardDescription>
                  Recent members who joined the organization
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href={`/dashboard/organization/${params.id}/members`}>
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {members.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Info</TableHead>
                      <TableHead className="text-right">Date Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow>
                        <TableCell>
                          <div className="font-medium">
                            {member.user.firstName}
                          </div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {member.user.email}
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          {formatDate(member.user.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  No members found
                </div>
              )}
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-5">
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <CalendarDaysIcon className="h-6 w-6" />
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">CSR</p>
                  <p className="text-sm text-muted-foreground">
                    Kajang, Selangor
                  </p>
                </div>
                <Button className="ml-auto">View</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
