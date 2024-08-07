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

type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

export function createApiResponse<T>(data: T | null, error: string | null): ApiResponse<T> {
  return { data, error };
}

export async function handleApiRequest<T>(
  requestFn: () => Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const data = await requestFn();
    return createApiResponse<T>(data, null);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return createApiResponse<T>(null, errorMessage);
  }
}