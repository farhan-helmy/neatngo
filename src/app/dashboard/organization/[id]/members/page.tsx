import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import { MembersTable } from "./MembersTable";
import { AddMemberForm } from "./AddMemberForm";
import { getMembers } from "./actions";

export default async function OrganizationMemberPage({
  params,
}: {
  params: { id: string };
}) {
  const members = await getMembers({ organizationId: params.id });

  if (!members) {
    return <div>loading...</div>;
  }
  return (
    <Layout>
      <LayoutHeader className="flex justify-between">
        Members
        <AddMemberForm />
      </LayoutHeader>
      <LayoutBody>
        <MembersTable
          members={members.map((member) => ({
            id: member.id || "",
            name: member.fullName || "",
            email: member.email || "",
            phone: member.phoneNumber || "",
          }))}
          organizationId={params.id}
        />
      </LayoutBody>
    </Layout>
  );
}
