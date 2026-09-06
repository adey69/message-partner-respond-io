import { QueryClient } from '@tanstack/react-query';

const MINUTE = 60_000;

export const CACHE_POLICY = {
  staleTime: 5 * MINUTE,
  gcTime: 30 * MINUTE,
} as const;

/**
 * The API serves a fixed dataset that never changes between requests, so the
 * cache is tuned to avoid refetching rather than to stay current. Freshness is
 * user-initiated through pull-to-refresh.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_POLICY.staleTime,
      gcTime: CACHE_POLICY.gcTime,
      retry: 1,
    },
  },
});
