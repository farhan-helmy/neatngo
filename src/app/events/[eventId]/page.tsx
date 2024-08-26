import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import ViewEvent from "./_components/ViewEvent";
import { checkUserRSVPd, getEvent } from "./_lib/actions";
import { Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import { toast } from "sonner";

export default async function EventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const eventData = await getEvent({ eventId: params.eventId });
  let userHasRSVPd = false;

  const user = await getUser();

  if (user) {
    const res = await checkUserRSVPd({ eventId: params.eventId, userId: user.id });

    if (res.error) {
      userHasRSVPd = false;
    } else {
      if (res.data) {
        userHasRSVPd = res.data;
      }
    }
  }

  console.log(eventData)

  if (!eventData.data?.event || eventData.error || eventData.data === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]  rounded-lg p-8">
        <Calendar className="w-16 h-16 text-gray-400 mb-4" />
        <AlertCircle className="w-8 h-8 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-200 mb-2">
          No Event Found
        </h2>
        <p className="text-gray-300 text-center max-w-md">
          We couldn&apos;t find the event you&apos;re looking for. It may have
          been removed or doesn&apos;t exist.
        </p>
        <Link href={"/"}>
          <Button className="mt-6 px-4 py-2">Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <Layout>
      <LayoutHeader></LayoutHeader>
      <LayoutBody>
        <ViewEvent event={eventData.data} user={user} userHasRSVPd={userHasRSVPd} />

      </LayoutBody>
    </Layout>
  );
}
