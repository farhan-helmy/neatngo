import { events } from "@/db/schema";
import { z } from "zod";

export const updateEventSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    eventType: z.enum(events.eventType.enumValues).optional(),
    isInternalEvent: z.boolean().optional(),
    startDate: z.date(),
    endDate: z.date(),
    location: z.string().optional(),
});

export type UpdateEventSchema = z.infer<typeof updateEventSchema>;