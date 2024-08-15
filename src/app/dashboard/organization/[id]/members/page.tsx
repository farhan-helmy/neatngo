import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import { MembersTable } from "./_components/MembersTable";
import { getMembers } from "./actions";
import NeatCrumb from "@/components/custom/NeatCrumb";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { searchParamsSchema } from "./schema";

export default async function OrganizationMemberPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search = searchParamsSchema.parse(searchParams);

  const membersPromise = getMembers({
    ...search,
    orgId: params.id,
  });

  return (
    <Layout>
      <LayoutHeader className="flex justify-between">
        <NeatCrumb
          items={[
            {
              label: "Members",
              href: `/dashboard/organization/${params.id}/members`,
            },
          ]}
        />
      </LayoutHeader>
      <LayoutBody>
        <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
          <DateRangePicker
            triggerSize="sm"
            triggerClassName="ml-auto w-56 sm:w-60"
            align="end"
          />
        </React.Suspense>
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
              shrinkZero
            />
          }
        ></React.Suspense>
        {/* <MembersTable
          members={members.map((member) => ({
            id: member.id || "",
            name: member.fullName || "",
            email: member.email || "",
            phone: member.phoneNumber || "",
          }))}
          organizationId={params.id}
        /> */}

        <MembersTable membersPromise={membersPromise} />
      </LayoutBody>
    </Layout>
  );
}
