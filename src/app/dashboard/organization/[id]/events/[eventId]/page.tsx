import { ChevronLeft, PlusCircle, Upload, UserCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { db } from "@/db";
import { events, EventType } from "@/db/schema";
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
import { cleanEventType } from "@/helper";
import NeatCrumb from "@/components/custom/NeatCrumb";

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

  const attendees = await db.query.eventRegistrations.findMany({
    where: eq(events.id, params.eventId),
    with: {
      user: {
        with: {
          memberships: true,
        },
      },
    },
  });

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <Layout>
      <LayoutHeader className="flex justify-between">
        <NeatCrumb
          items={[
            {
              label: "Organization",
              href: `/dashboard/organization/${params.id}`,
            },
            {
              label: "Event",
              href: `/dashboard/organization/${params.id}/events`,
            },
            {
              label: `${event.name}`,
              href: `/dashboard/organization/${params.id}/events/${params.eventId}  `,
            },
          ]}
        />
      </LayoutHeader>
      <LayoutBody>
        <div className="grid  flex-1 auto-rows-max gap-4">
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
              {cleanEventType({
                eventType: event.eventType as EventType,
              })}
            </Badge>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Link
                href={`/dashboard/organization/${params.id}/events/${params.eventId}/edit`}
                passHref
              >
                <Button size="sm">Edit</Button>
              </Link>
            </div>
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
                    {attendees.length > 0 ? (
                      attendees.map((attendee) => (
                        <div
                          key={attendee.id}
                          className="grid grid-cols-3 gap-3"
                        >
                          <div className="flex items-center gap-2">
                            <UserCircle className="h-8 w-8" />
                            <div>
                              <div className="font-medium">
                                {attendee.user.firstName}
                              </div>
                              <div className="text-muted-foreground">
                                {attendee.user.email}
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <Label>Role</Label>
                                <div>{attendee.user.memberships[0].role}</div>
                              </div>
                              <div>
                                <Label>Registration Date</Label>
                                <div>
                                  {new Date(
                                    attendee.registrationDate
                                  ).toLocaleString()}
                                </div>
                              </div>
                              <div>
                                <Label>Attended</Label>
                                <div>{attendee.attended ? "Yes" : "No"}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center  text-muted-foreground">
                        <span>No participants yet</span>
                      </div>
                    )}
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
                      <div>
                        {cleanEventType({
                          eventType: event.eventType as EventType,
                        })}
                      </div>
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
