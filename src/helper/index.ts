import { EventType, eventTypeEnum } from "@/db/schema";
import { format, parseISO } from "date-fns";

import type { BuildQueryResult, DBQueryConfig, ExtractTablesWithRelations } from 'drizzle-orm';
import * as schema from '@/db/schema';

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  'one' | 'many',
  boolean,
  TSchema,
  TSchema[TableName]
>['with'];

export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;
export function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateWithNumbers(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function formatDateForInput(dateString: string) {
  return format(parseISO(dateString), "yyyy-MM-dd'T'HH:mm");
}

type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

export function createApiResponse<T>(
  data: T | null,
  error: string | null
): ApiResponse<T> {
  return { data, error };
}

export async function handleApiRequest<T>(
  requestFn: () => Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const data = await requestFn();
    return createApiResponse<T>(data, null);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return createApiResponse<T>(null, errorMessage);
  }
}

export function cleanEventType({ eventType }: { eventType: string }) {

  const eventTypeLabels: Record<EventType, string> = {
    WORKSHOP: "Workshop",
    FUNDRAISER: "Fundraiser",
    VOLUNTEERING: "Volunteering",
    MEETING: "Meeting",
    OTHER: "Other",
  };

  const isValidEventType = (type: string): type is EventType =>
    eventTypeEnum.enumValues.includes(type as EventType);

  const eventTypeLabel = isValidEventType(eventType)
    ? eventTypeLabels[eventType]
    : "Unknown Event Type";

  return eventTypeLabel
}
