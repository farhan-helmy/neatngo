import { ChevronLeft, PlusCircle, Upload, UserCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { db } from "@/db";
import { events, eventTypeEnum } from "@/db/schema";
import { eq } from "drizzle-orm";

import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { formatDuration } from "date-fns";

type EventType = (typeof eventTypeEnum.enumValues)[number];

const eventTypeLabels: Record<EventType, string> = {
  WORKSHOP: "Workshop",
  FUNDRAISER: "Fundraiser",
  VOLUNTEER_ACTIVITY: "Volunteer Activity",
  MEETING: "Meeting",
  OTHER: "Other",
};

const dummyParticipants = [
  { id: 1, name: "Alice Johnson", role: "Attendee" },
  { id: 2, name: "Bob Smith", role: "Speaker" },
  { id: 3, name: "Charlie Brown", role: "Organizer" },
  { id: 4, name: "Diana Prince", role: "Attendee" },
  { id: 5, name: "Ethan Hunt", role: "Volunteer" },
];

export default async function ViewEventPage({
  params,
}: {
  params: { id: string; eventId: string };
}) {
  const event = await db.query.events.findFirst({
    where: eq(events.id, params.eventId),
    with: {
      organization: true,
    },
  });

  if (!event) {
    return <div>Event not found</div>;
  }

  const isValidEventType = (type: string): type is EventType =>
    eventTypeEnum.enumValues.includes(type as EventType);

  const eventTypeLabel = isValidEventType(event.eventType)
    ? eventTypeLabels[event.eventType]
    : "Unknown Event Type";

  return (
    <Layout>
      <LayoutHeader className="flex justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/dashboard/organization/${params.id}`}>
                Organization
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/dashboard/organization/${params.id}/events`}
              >
                Events
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{event.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </LayoutHeader>
      <LayoutBody>
        <div className="grid max-w-[59rem] flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/organization/${params.id}/events`} passHref>
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              {event.name}
            </h1>
            <Badge variant="outline" className="ml-auto sm:ml-0">
              {eventTypeLabel}
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                  <CardDescription>
                    General information about the event.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Name</Label>
                      <div className="font-medium">{event.name}</div>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="description">Description</Label>
                      <div className="whitespace-pre-wrap">
                        {event.description || "No description provided."}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Event Participants</CardTitle>
                  <CardDescription>
                    People involved in this event.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dummyParticipants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center gap-3"
                      >
                        <UserCircle className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{participant.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {participant.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button size="sm" variant="outline">
                      View All Participants
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label>Event Type</Label>
                      <div>{eventTypeLabel}</div>
                    </div>
                    <div className="grid gap-3">
                      <Label>Max Attendees</Label>
                      <div>{event.maxAttendees || "Unlimited"}</div>
                    </div>
                    <div className="grid gap-3">
                      <Label>Start Date and Time</Label>
                      <div>{new Date(event.startDate).toLocaleString()}</div>
                    </div>
                    <div className="grid gap-3">
                      <Label>End Date and Time</Label>
                      <div>{new Date(event.endDate).toLocaleString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Event Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <Image
                      alt="Event image"
                      className="aspect-square w-full rounded-md object-cover"
                      height="84"
                      src={`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=pluh`}
                      width="84"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <button>
                        <Image
                          alt="Event image"
                          className="aspect-square w-full rounded-md object-cover"
                          height="84"
                          src={`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=kaicenat`}
                          width="84"
                        />
                      </button>
                      <button>
                        <Image
                          alt="Event image"
                          className="aspect-square w-full rounded-md object-cover"
                          height="84"
                          src={`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=dota`}
                          width="84"
                        />
                      </button>
                      {/* <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </LayoutBody>
    </Layout>
  );
}
