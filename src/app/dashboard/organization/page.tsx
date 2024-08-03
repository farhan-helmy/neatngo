import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import { Button } from "@/components/ui/button";
import { AddOrganization } from "./AddOrganiziation";

export default function OrganizationPage() {
  return (
    <Layout>
      <LayoutHeader className="flex justify-between">
        Organization
        <AddOrganization />
      </LayoutHeader>
      <LayoutBody>
        <p>Organization page content</p>
      </LayoutBody>
    </Layout>
  );
}
