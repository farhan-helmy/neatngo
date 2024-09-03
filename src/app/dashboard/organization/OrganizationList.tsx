"use client";

import { Switch } from "@/components/ui/switch";
import { EyeIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { deleteOrganization, toggleOrganizationStatus } from "./actions";
import {
  DialogContent,
  DialogTrigger,
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Step } from 'react-joyride';
import dynamic from 'next/dynamic';

const JoyRideNoSSR = dynamic(
  () => import('react-joyride'),
  { ssr: false }
);

export function OrganizationList({
  id,
  name,
  isPublic,
}: {
  id: string;
  name: string;
  isPublic: boolean;
}) {
  

  return (
    <div
      key={id}
      className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 max-w-56"
    >
      <div className="flex items-center gap-x-4 border-b border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
        <Image
          src={`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${name}`}
          alt={name}
          className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10 dark:bg-gray-700 dark:ring-gray-100/10"
          height={48}
          width={48}
        />
        <div className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-100 truncate">
          {name}
        </div>
        <div className="relative ml-auto flex gap-2">
          <div className="view-organization">
            <Link
            className={`-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200`}
            href={`/dashboard/organization/${id}`}
          >
              <EyeIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <button className="-m-2.5 block p-2.5 text-gray-400 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400">
                <TrashIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your orgnization
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:space-x-0">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  aria-label="Delete selected rows"
                  variant="destructive"
                  onClick={() => {
                    deleteOrganization({ id });
                    toast.message("Organization has been deleted", {
                      description: name,
                    });
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6 dark:divide-gray-700">
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500 dark:text-gray-400">Show to public</dt>
          <Switch
            checked={isPublic}
            onCheckedChange={async (value) => {
              const res = await toggleOrganizationStatus({
                id: id!,
                isPublic: value,
              });

              if (res.error) {
                toast.error(res.error);
                return;
              }
              toast.success(
                `Organization status set to ${value ? "public" : "private"}`
              );
            }}
          />
        </div>
      </dl>
    </div>
  );
}
