import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import { Button } from "@/components/ui/button";
import { MembersTable } from "./MembersTable";
import { AddMemberForm } from "./AddMemberForm";

export default function OrganizationMemberPage() {
  return (
    <Layout>
      <LayoutHeader className="flex justify-between">
        Members
        <AddMemberForm />
      </LayoutHeader>
      <LayoutBody>
        <MembersTable />
      </LayoutBody>
    </Layout>
  );
}
