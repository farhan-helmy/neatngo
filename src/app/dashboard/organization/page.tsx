import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import { AddOrganizationDialog } from "./AddOrganiziationDialog";
import { db } from "@/db";
import { organizations, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { OrganizationList } from "./OrganizationList";
import { EmptyState } from "./EmptyState";

export default async function OrganizationPage() {
  const { sessionClaims } = auth();

  const email =
    process.env.ENVIRONMENT === "dev"
      ? process.env.DEMO_USER_EMAIL
      : sessionClaims?.email;

  const org = await db.transaction(async (tx) => {
    const user = await tx
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email as string));

    const organizationList = await tx
      .select({ id: organizations.id, name: organizations.name, isPublic: organizations.isPublic })
      .from(organizations)
      .where(eq(organizations.createdById, user[0].id))
      .orderBy(desc(organizations.createdAt));

    return organizationList;
  });

  return (
    <Layout>
      <LayoutHeader className="flex justify-between">
        Organization
        <AddOrganizationDialog />
      </LayoutHeader>
      <LayoutBody>
        {org.length > 0 ? (
          <div className="flex gap-4">
            {org.map((o) => (
              <OrganizationList key={o.id} id={o.id} name={o.name} isPublic={o.isPublic}/>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </LayoutBody>
    </Layout>
  );
}
