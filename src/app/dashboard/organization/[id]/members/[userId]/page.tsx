import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import NeatCrumb from "@/components/custom/NeatCrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { memberships } from "@/db/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { eq } from "drizzle-orm";
import { Edit2, X } from "lucide-react";
import Link from "next/link";
import { EditMemberForm } from "./EditMemberForm";

export default async function ViewMemberPage({
  params,
  searchParams,
}: {
  params: { userId: string; id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const person = await db.query.users.findFirst({
    where: eq(memberships.id, params.userId),
    with: {
      memberships: {
        where: eq(memberships.organizationId, params.id),
      },
    },
  });

  if (!person) {
    return <div>loading...</div>;
  }

  return (
    <Layout>
      <LayoutHeader className="flex justify-between">
        <NeatCrumb
          items={[
            {
              label: "Members",
              href: `/dashboard/organization/${params.id}/members`,
            },
            {
              label: person.id,
              href: `/dashboard/organization/${params.id}/members/${params.userId}`,
            },
          ]}
        />
      </LayoutHeader>
      <LayoutBody>
        <div className="flex items-center justify-center flex-col pb-12">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${params.userId}`}
              alt={params.userId}
            />
            {/* <AvatarFallback>{person?.firstName?.charAt(0)}</AvatarFallback> */}
          </Avatar>
          <div>
            <h1 className="font-bold text-center">{person?.firstName}</h1>
            {/* <p className="text-muted-foreground">{person.role}</p> */}
          </div>
        </div>

        <div className=" px-56">
          <Card className="mx-auto">
            <CardHeader className="font-semibold justify-between flex flex-row">
              {searchParams.action === "edit" ? (
                <>
                  Edit User Info
                  <div className="flex gap-2 flex-row">
                    <Link
                      href={`/dashboard/organization/${params.id}/members/${params.userId}`}
                    >
                      <Button className="flex gap-2" variant="link">
                        <X size={20} />
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  User Info
                  <Link
                    href={`/dashboard/organization/${params.id}/members/${params.userId}?action=edit`}
                  >
                    <Button className="flex gap-2">
                      <Edit2 size={20} />
                      Edit
                    </Button>
                  </Link>
                </>
              )}
            </CardHeader>
            <CardContent>
              <EditMemberForm user={person} />
            </CardContent>
          </Card>
        </div>
      </LayoutBody>
    </Layout>
  );
}
