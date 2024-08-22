"use client";

import { Switch } from "@/components/ui/switch";
import { CogIcon, EyeIcon, PenIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { deleteOrganization, toggleOrganizationStatus } from "./actions";

export function OrganizationList({ id, name, isPublic }: { id: string; name: string; isPublic: boolean }) {
  return (
    <div key={id} className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-x-4 border-b border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
        <Image
          src={`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${name}`}
          alt={name}
          className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10 dark:bg-gray-700 dark:ring-gray-100/10"
          height={48}
          width={48}
        />
        <div className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">
          {name}
        </div>
        <div className="relative ml-auto flex gap-2">
          <Link
            className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
            href={`/dashboard/organization/${id}`}
          >
            <EyeIcon className="h-4 w-4" aria-hidden="true" />
          </Link>

          <button
            onClick={() => {
              deleteOrganization({ id });
              toast.message("Organization has been deleted", {
                description: name,
              });
            }}
            className="-m-2.5 block p-2.5 text-gray-400 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400"
          >
            <TrashIcon className="h-4 w-4" aria-hidden="true" />
          </button>
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
              toast.success(`Organization status set to ${value ? "public" : "private"}`);
            }}
          />
        </div>
      </dl>
    </div>
  );
}