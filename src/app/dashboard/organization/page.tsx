import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import { AddOrganizationDialog } from "./AddOrganiziationDialog";
import { db } from "@/db";
import { organizations, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { OrganizationList } from "./OrganizationList";

export default async function OrganizationPage() {
  const { sessionClaims } = auth();

  const org = await db.transaction(async (tx) => {
    const user = await tx
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, sessionClaims?.email as string));

    const organizationList = await tx
      .select({ id: organizations.id, name: organizations.name })
      .from(organizations)
      .where(eq(organizations.createdById, user[0].id));

    return organizationList;
  });
  return (
    <Layout>
      <LayoutHeader className="flex justify-between">
        Organization
        <AddOrganizationDialog />
      </LayoutHeader>
      <LayoutBody>
        <div className="grid grid-cols-3 gap-4">
          {org.map((o) => (
            <OrganizationList key={o.id} id={o.id} name={o.name} />
          ))}
        </div>
      </LayoutBody>
    </Layout>
  );
}
