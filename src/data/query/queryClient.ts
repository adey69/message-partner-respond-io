import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/data/api/client';

const MINUTE = 60_000;

export const CACHE_POLICY = {
  staleTime: 5 * MINUTE,
  gcTime: 30 * MINUTE,
  perContactGcTime: 10 * MINUTE,
} as const;

const RETRIES = 1;

/**
 * A 4xx is an answer rather than a fault: repeating the request cannot change
 * it. Retrying one only spends a second request, which matters on an API that
 * allows 100 a minute — a rate-limited response would be answered by asking
 * again, twice as fast.
 */
export const shouldRetry = (failureCount: number, error: Error): boolean => {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
    return false;
  }

  return failureCount < RETRIES;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_POLICY.staleTime,
      gcTime: CACHE_POLICY.gcTime,
      retry: shouldRetry,

      // Freshness is user-initiated, through pull-to-refresh. Refetching when
      // the app returns to the foreground would re-request every page an
      // infinite query has loaded, which is what pull-to-refresh trims the
      // cache to one page to avoid.
      refetchOnWindowFocus: false,
    },
  },
});
