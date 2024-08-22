import { Separator } from "@/components/ui/separator";
import { GeneralForm } from "./general";

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">General</h3>
        <p className="text-sm text-muted-foreground">
          General settings for your organization.
        </p>
      </div>
      <Separator />
      <GeneralForm />
    </div>
  )
}