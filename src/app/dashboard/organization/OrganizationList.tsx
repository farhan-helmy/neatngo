"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye } from "lucide-react";

export function OrganizationList({ id, name }: { id: string; name: string }) {
  return (
    <Card>
      <CardContent>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
      </CardContent>
      <CardFooter className="flex items-end justify-end">
        <Button>View</Button>
      </CardFooter>
    </Card>
  );
}
