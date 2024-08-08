"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EyeIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function OrganizationList({ id, name }: { id: string; name: string }) {
  return (
    // <Card>
    //   <CardContent>
    //     <CardHeader>
    //       <CardTitle>{name}</CardTitle>
    //     </CardHeader>
    //   </CardContent>
    //   <CardFooter className="flex items-end justify-end">
    //     <Button asChild>
    //       <Link href={`/dashboard/organization/${id}`}>View</Link>
    //     </Button>
    //   </CardFooter>
    // </Card>

    <div key={id} className="overflow-hidden rounded-xl border border-gray-200">
      <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
        <Image
          src={`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${name}`}
          alt={name}
          className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
          height={48}
          width={48}
        />
        <div className="text-sm font-medium leading-6 text-gray-900">
          {name}
        </div>
        <div className="relative ml-auto flex gap-2">
          <Link
            className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500"
            href={`/dashboard/organization/${id}`}
          >
            <EyeIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button
            onClick={() => console.log("nigga")}
            className="-m-2.5 block p-2.5 text-gray-400 hover:text-red-500"
          >
            <TrashIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
        <div className="flex justify-between gap-x-4 py-3">
          {/* <dt className="text-gray-500">Created by</dt>
          <dd className="text-gray-700">{}</dd> */}
        </div>
        {/* <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Amount</dt>
              <dd className="flex items-start gap-x-2">
                <div className="font-medium text-gray-900">
                  {client.lastInvoice.amount}
                </div>
              </dd>
            </div> */}
      </dl>
    </div>
  );
}
