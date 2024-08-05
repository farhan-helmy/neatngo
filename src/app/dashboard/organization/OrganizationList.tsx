"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export function OrganizationList({ id, name }: { id: string; name: string }) {
  return (
    <Card>
      <CardContent>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
      </CardContent>
      <CardFooter className="flex items-end justify-end">
        <Button asChild>
          <Link href={`/dashboard/organization/${id}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
