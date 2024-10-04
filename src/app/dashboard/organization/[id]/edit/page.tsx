import { Separator } from "@/components/ui/separator";
import { GeneralForm } from "./_components/general";
import { getOrganization } from "../../_lib/actions";

export default async function EditOrganizationPage({ params }: { params: { id: string } }) {
  const organization = await getOrganization({ id: params.id });

  if (!organization) {
    return <div>Organization not found.</div>
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">General</h3>
        <p className="text-sm text-muted-foreground">
          General settings for your organization.
        </p>
      </div>
      <Separator />
      <GeneralForm organization={organization} />
    </div>
  );
}
