import { events } from "@/db/schema";
import { z } from "zod";

export const updateEventSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or less"),
    description: z.string().optional(),
    eventType: z.enum(events.eventType.enumValues),
    isInternalEvent: z.boolean(),
    startDate: z.date(),
    endDate: z.date(),
    location: z.string().min(1, "Location is required"),
    maxAttendees: z.number().int().nonnegative().optional(),
});

export type UpdateEventSchema = z.infer<typeof updateEventSchema>;