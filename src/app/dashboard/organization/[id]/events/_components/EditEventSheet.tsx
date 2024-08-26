"use client";

import * as React from "react";
import { events, users, type UserWithMemberships } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

import { saveDescription, updateEvent } from "../_lib/actions";
import { Input } from "@/components/ui/input";
import { useParams, useSearchParams } from "next/navigation";
import { EventResults } from "../_lib/type";
import { updateEventSchema, type UpdateEventSchema } from "../_lib/validations";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isBefore } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Edit2, Link } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { formatEventType } from "../_lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { MinimalTiptapEditor } from "@/components/custom/minimal-tiptap";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Content } from "@tiptap/core";
import SafeHTML from "@/components/safe-html";

interface UpdateEventSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  event: EventResults;
  isServer?: boolean;
}

export function UpdateEventSheet({ event, isServer, ...props }: UpdateEventSheetProps) {
  const [isUpdatePending, startUpdateTransition] = React.useTransition();
  const [value, setValue] = React.useState("");

  const params = useParams<{ id: string }>();

  const searchParams = useSearchParams();

  const action = searchParams.get("action");

  const form = useForm<UpdateEventSchema>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      name: event.name ?? "",
      location: event.location ?? "",
      isInternalEvent: event.isInternalEvent ?? false,
      eventType: event.eventType ?? "",
      startDate: (event.startDate as Date) ?? new Date(),
      endDate: (event.endDate as Date) ?? new Date(),
      maxAttendees: event.maxAttendees ?? 0,
    },
  });

  React.useEffect(() => {
    form.reset({
      name: event.name ?? "",
      location: event.location ?? "",
      eventType: event.eventType ?? "",
      isInternalEvent: event.isInternalEvent ?? false,
      startDate: (event.startDate as Date) ?? new Date(),
      endDate: (event.endDate as Date) ?? new Date(),
      maxAttendees: event.maxAttendees ?? 0,
    });
  }, [event, form]);

  React.useEffect(() => {
    if (action === 'editClose') {
      props.onOpenChange?.(false);
    }
  }, [action, props]);

  function onSubmit(input: UpdateEventSchema) {
    startUpdateTransition(async () => {
      const { error } = await updateEvent({
        id: event.id,
        orgId: params.id,
        ...input,
      });

      if (error) {
        toast.error(error);
        return;
      }

      form.reset();
      props.onOpenChange?.(false);
      toast.success("Event updated");
    });
  }

  async function handleSaveDescription() {
    const res = await saveDescription({
      description: value,
      eventId: event.id,
    });

    if (res.error) {
      toast.error(res.error);
      return;
    }

    toast.success("Description updated");
  }

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md overflow-auto" isServer={isServer} href={`/dashboard/organization/${params.id}/events/${event.id}?action=editClose`}>
        <SheetHeader className="text-left">
          <SheetTitle>
            Update Event
            <Button
              variant={"ghost"}
              onClick={() => {
                navigator.clipboard.writeText(
                  `${
                    process.env.NEXT_PUBLIC_ENVIRONMENT === "dev"
                      ? "https://demo.neatngo.com/events/"
                      : "https://neatngo.com/events/"
                  }${event.id}`
                );
                toast.success("Event link copied to clipboard");
              }}
            >
              <Link className="w-4 h-4" />
            </Button>
          </SheetTitle>
          <SheetDescription>
            Update the event details and save the changes
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Bangi" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={(e) => {
                            e.preventDefault;
                          }}
                          variant={"ghost"}
                        >
                          <Edit2 className="" height={18} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-screen overflow-auto sm:max-w-[700px]">
                        <DialogHeader>
                          <DialogTitle>Edit description</DialogTitle>
                        </DialogHeader>
                        <div className="flex w-full">
                          <MinimalTiptapEditor
                            value={event.description}
                            onChange={(value) => {
                              setValue(value as string);
                              form.setValue("description", value as string);
                            }}
                            throttleDelay={2000}
                            className="w-full"
                            editorContentClassName="p-5"
                            output="html"
                            placeholder="Type your description here..."
                            autofocus={true}
                            immediatelyRender={true}
                            editable={true}
                            injectCSS={true}
                            editorClassName="focus:outline-none"
                          />
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={() => {
                              handleSaveDescription();
                            }}
                          >
                            Save changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </FormControl>
                  <div className="container mx-auto p-4 h-24 overflow-auto">
                    <SafeHTML
                      html={event.description ?? ""}
                      className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {events.eventType.enumValues.map((value) => (
                        <SelectItem key={value} value={value}>
                          {formatEventType(value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isInternalEvent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <FormLabel>Internal event</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          const startDate = form.getValues("startDate");
                          return (
                            date < new Date("1900-01-01") ||
                            (startDate && isBefore(date, startDate))
                          );
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxAttendees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Attendees</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Set the maximum number of attendees for this event. Leave as 0 for unlimited.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isUpdatePending}>
              {isUpdatePending ? "Updating..." : "Update"}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
