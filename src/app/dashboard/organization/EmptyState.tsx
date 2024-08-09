"use client";

import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center pt-24">
      <svg
        className="w-16 h-16 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        No organizations yet
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Get started by creating a new organization.
      </p>
      <Button className="mt-4">Create organization</Button>
    </div>
  );
}
