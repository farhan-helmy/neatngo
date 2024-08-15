import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import { db } from "@/db";
import { memberships, organizations } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { OrganizationPageContent } from "./OrganizationPageContent";

export default async function ViewOrganizationPage({
  params,
}: {
  params: { id: string };
}) {
  const orgMembers = await db.query.memberships.findMany({
    where: eq(memberships.organizationId, params.id),
    with: {
      user: true,
    },
  });

  const orgName = await db
    .select({ name: organizations.name })
    .from(organizations)
    .where(eq(organizations.id, params.id));

  return (
    <Layout>
      <LayoutHeader className="">{orgName[0].name} Home</LayoutHeader>
      <LayoutBody>
        <OrganizationPageContent members={orgMembers} />
      </LayoutBody>
    </Layout>
  );
}
