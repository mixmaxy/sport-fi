interface PaginatedApiResult<T> {
  data: T[];
}

interface BootcampApiEnvelope<T> {
  error: boolean;
  result: T;
}

/** Unwraps bootcamp API `{ error, result }` (paginated or single) and legacy `{ data }` envelopes. */
export function unwrapApiResult<T>(body: unknown): T {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid API response");
  }

  if (
    "data" in body &&
    (body as { data?: T }).data !== undefined &&
    !("result" in body)
  ) {
    return (body as { data: T }).data;
  }

  const envelope = body as BootcampApiEnvelope<
    PaginatedApiResult<unknown> | unknown
  >;
  if (!("result" in envelope) || envelope.result === undefined) {
    throw new Error("Missing result in API response");
  }

  const { result } = envelope;
  if (
    result &&
    typeof result === "object" &&
    "data" in result &&
    Array.isArray((result as PaginatedApiResult<unknown>).data)
  ) {
    return (result as PaginatedApiResult<unknown>).data as T;
  }

  return result as T;
}

/** Keeps Laravel pagination fields for client list endpoints. */
export function unwrapPaginatedResult<T>(body: unknown): {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
} {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid API response");
  }

  const envelope = body as BootcampApiEnvelope<
    PaginatedApiResult<T> & {
      current_page?: number;
      last_page?: number;
      per_page?: number;
      total?: number;
    }
  >;

  if (!("result" in envelope) || envelope.result === undefined) {
    throw new Error("Missing result in API response");
  }

  const { result } = envelope;
  if (
    result &&
    typeof result === "object" &&
    "data" in result &&
    Array.isArray(result.data)
  ) {
    const items = result.data;
    return {
      data: items,
      current_page: result.current_page ?? 1,
      last_page: result.last_page ?? 1,
      per_page: result.per_page ?? items.length,
      total: result.total ?? items.length,
    };
  }

  if (Array.isArray(result)) {
    return {
      data: result,
      current_page: 1,
      last_page: 1,
      per_page: result.length,
      total: result.length,
    };
  }

  throw new Error("Invalid paginated API response");
}
