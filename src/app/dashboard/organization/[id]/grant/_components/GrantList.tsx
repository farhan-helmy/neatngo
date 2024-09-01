"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for grants
const mockGrants = [
  { id: 1, name: "Community Development Grant", amount: 5000, status: "Open" },
  { id: 2, name: "Education Support Fund", amount: 7500, status: "Closed" },
  { id: 3, name: "Environmental Protection Grant", amount: 10000, status: "Open" },
  { id: 4, name: "Healthcare Initiative Grant", amount: 15000, status: "Under Review" },
];

export function GrantList() {
  const [grants, setGrants] = useState(mockGrants);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grant List</CardTitle>
        <CardDescription>View and manage available grants for your organization</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grants.map((grant) => (
              <TableRow key={grant.id}>
                <TableCell>{grant.name}</TableCell>
                <TableCell>${grant.amount.toLocaleString()}</TableCell>
                <TableCell>{grant.status}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    {grant.status === "Open" ? "Apply" : "View"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}