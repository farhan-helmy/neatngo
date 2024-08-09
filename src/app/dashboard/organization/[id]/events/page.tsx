import { Layout, LayoutHeader } from "@/components/custom/layout";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";

export default function EventPage() {
  return (
    <Layout>
      <LayoutHeader className="flex justify-between">
        Event Page
        <Button>
          <PlusCircleIcon />
          Add Event
        </Button>
      </LayoutHeader>
    </Layout>
  );
}
