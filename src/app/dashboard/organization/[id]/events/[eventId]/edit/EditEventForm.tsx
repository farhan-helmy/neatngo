"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { EventType, eventTypeEnum, SelectEvent } from "@/db/schema";
import { updateEvent } from "./actions";
import { useLoading } from "@/hooks/useLoading";
import { cleanEventType } from "@/helper";
import { editEventFormSchema, eventFormSchema } from "../../event.schema";
import { format, set } from "date-fns";

export function EditEventForm({ event }: { event: SelectEvent }) {
  const params = useParams();

  const { withLoading, isLoading } = useLoading();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(editEventFormSchema),
    defaultValues: {
      name: event?.name || "",
      description: event?.description || "",
      eventType: event?.eventType || "",
      maxAttendees: event?.maxAttendees || 1,
      startDate: format(new Date(event.startDate), "yyyy-MM-dd") || "",
      endDate: format(new Date(event.endDate), "yyyy-MM-dd") || "",
      location: event?.location || "",
    },
  });

  const onSubmit = withLoading(
    async (values: z.infer<typeof editEventFormSchema>) => {
      const response = await updateEvent({
        name: values.name,
        description: values.description,
        eventType: values.eventType,
        startDate: new Date(values.startDate),
        endDate: new Date(values.endDate),
        location: values.location,
        maxAttendees: values.maxAttendees,
        eventId: params.eventId as string,
      });

      if (response.error) {
        toast.error(response.error);
      } else if (response.data) {
        toast.success("Event saved");
      }
    }
  );

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
              <BreadcrumbLink
                href={`/dashboard/organization/${params.id}/events/${params.eventId}`}
              >
                {event?.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </LayoutHeader>
      <LayoutBody>
        <div className="grid flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/dashboard/organization/${params.id}/events/${params.eventId}`}
              passHref
            >
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              {event?.name}
            </h1>
            <Badge variant="outline" className="ml-auto sm:ml-0">
              {cleanEventType({
                eventType: event?.eventType as EventType,
              }) || "Unknown"}
            </Badge>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.message("Not yet implemented.")}
              >
                Discard
              </Button>
              <Button size="sm" onClick={() => handleSubmit(onSubmit)()}>
                Save Event
              </Button>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8"
          >
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
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-red-500">{errors.name.message}</p>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        className="min-h-32"
                        placeholder="Event description"
                        {...register("description")}
                      />
                      {errors.description && (
                        <p className="text-red-500">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        type="text"
                        className="w-full"
                        {...register("location")}
                      />
                      {errors.location && (
                        <p className="text-red-500">
                          {errors.location.message}
                        </p>
                      )}
                    </div>
                  </div>
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
                      <Select
                        defaultValue={event.eventType}
                        onValueChange={(val) =>
                          setValue("eventType", val as EventType)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypeEnum.enumValues.map((value) => (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.eventType && (
                        <p className="text-red-500">
                          {errors.eventType.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="maxAttendees">Max Attendees</Label>
                      <Input
                        id="maxAttendees"
                        type="number"
                        min={1}
                        {...register("maxAttendees")}
                      />
                      {errors.maxAttendees && (
                        <p className="text-red-500">
                          {errors.maxAttendees.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Event Dates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        {...register("startDate")}
                      />
                      {errors.startDate && (
                        <p className="text-red-500">
                          {errors.startDate.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        {...register("endDate")}
                      />
                      {errors.endDate && (
                        <p className="text-red-500">{errors.endDate.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </LayoutBody>
    </Layout>
  );
}
