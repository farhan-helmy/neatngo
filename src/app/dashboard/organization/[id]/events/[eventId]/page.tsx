import { ChevronLeft, PlusCircle, Upload } from "lucide-react";
import Image from "next/image";

import { db } from "@/db";
import { events, eventTypeEnum } from "@/db/schema";
import { eq } from "drizzle-orm";

import { Layout, LayoutBody, LayoutHeader } from "@/components/custom/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default async function viewEventPage({
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

  const eventTypeLabels = {
    WORKSHOP: "Workshop",
    FUNDRAISER: "Fundraiser",
    VOLUNTEER_ACTIVITY: "Volunteer Activity",
    MEETING: "Meeting",
    OTHER: "Other",
  };

  return (
    <Layout>
      <LayoutHeader className="flex justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/organization/${params.id}">
                Organization
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/organization/${params.id}/events">
                Events
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{event?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </LayoutHeader>
      <LayoutBody>
        <div className="grid max-w-[59rem] flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              {event?.name}
            </h1>
            <Badge variant="outline" className="ml-auto sm:ml-0">
              pluh
            </Badge>
            {/* can reuse for edit page */}
            {/* <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm">Save Product</Button>
            </div> */}
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
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
                        defaultValue={event?.name}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        className="min-h-32"
                        placeholder="Event description"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Publish Event</CardTitle>
                  <CardDescription>
                    Publish the event to the public.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div></div>
                  <Button size="sm" variant="secondary">
                    Publish Event
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Miscellaneous</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="eventType">Event Type</Label>
                      <Select>
                        <SelectTrigger
                          id="eventType"
                          aria-label="Select event type"
                        >
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypeEnum.enumValues.map((value) => (
                            <SelectItem key={value} value={value}>
                              {eventTypeLabels[value] || value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Label htmlFor="maxAttendees">Max Attendees</Label>
                      <Input
                        type="number"
                        min={1}
                        defaultValue={event?.maxAttendees}
                      />
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
                      <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button variant="outline" size="sm">
              Discard
            </Button>
            <Button size="sm">Save Product</Button>
          </div>
        </div>
      </LayoutBody>
    </Layout>
  );
}
