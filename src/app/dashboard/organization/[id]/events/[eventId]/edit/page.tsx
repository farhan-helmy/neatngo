"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

import { eventTypeEnum } from "@/db/schema";
import { updateEvent } from "../../actions";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  eventType: z.enum(eventTypeEnum.enumValues),
  maxAttendees: z.number().min(1, "At least one attendee required"),
  startDate: z.string().nonempty("Start date is required"),
  endDate: z.string().nonempty("End date is required"),
  location: z.string().min(1, "Location is required"),
});

export default function EditEventPage({
  params,
  event,
}: {
  params: { id: string; eventId: string };
  event: any;
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: event?.name || "",
      description: event?.description || "",
      eventType: event?.eventType || "",
      maxAttendees: event?.maxAttendees || 1,
      startDate: event?.startDate
        ? new Date(event?.startDate).toISOString().split("T")[0]
        : "",
      endDate: event?.endDate
        ? new Date(event?.endDate).toISOString().split("T")[0]
        : "",
      location: event?.location || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateEvent({
        eventId: params.eventId,
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        maxAttendees: Number(data.maxAttendees),
      });
      toast.success("Event updated successfully");
      router.push(
        `/dashboard/organization/${params.id}/events/${params.eventId}`
      );
    } catch (error) {
      toast.error(error.message || "Failed to update event");
    }
  };

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
        <div className="grid max-w-[59rem] flex-1 auto-rows-max gap-4">
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
              {event?.eventType || "Unknown"}
            </Badge>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.message("Not yet implemented.")}
              >
                Discard
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  toast.message("Not yet implemented.");
                }}
              >
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
                      <Select {...register("eventType")}>
                        <SelectTrigger
                          id="eventType"
                          aria-label="Select event type"
                        >
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
