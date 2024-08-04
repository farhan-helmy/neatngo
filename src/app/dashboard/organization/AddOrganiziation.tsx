"use client";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AddOrganization() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon className="w-6 h-6 mr-2" />
          Organization
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Organization</DialogTitle>
        </DialogHeader>
        <div>
          <div className="space-y-2">
            <Label>Organization Name</Label>
            <Input
              type="text"
              placeholder="Organization Name"
              id="organizationName"
            />
          </div>
        </div>
        <DialogFooter>
          <Button>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
