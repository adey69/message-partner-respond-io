import { QueryClient } from '@tanstack/react-query';

const MINUTE = 60_000;

/**
 * The API serves a fixed dataset that never changes between requests, so the
 * cache is tuned to avoid refetching rather than to stay current. Freshness is
 * user-initiated through pull-to-refresh.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * MINUTE,
      gcTime: 30 * MINUTE,
      retry: 1,
    },
  },
});
