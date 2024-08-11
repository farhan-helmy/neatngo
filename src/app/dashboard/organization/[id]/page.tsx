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

  return (
    <Layout>
      <LayoutHeader></LayoutHeader>
      <LayoutBody>
        <OrganizationPageContent members={orgMembers} />
      </LayoutBody>
    </Layout>
  );
}
