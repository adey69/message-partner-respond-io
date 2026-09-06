import { QueryClient } from '@tanstack/react-query';

const clients: QueryClient[] = [];

/**
 * A client for one test. Retries are off so a failed request reaches the error
 * state on the first attempt instead of making the test wait out the chain.
 */
export function testQueryClient(): QueryClient {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  clients.push(client);
  return client;
}

/**
 * Cached entries schedule their own garbage collection, and those timers hold
 * the test process open long after the assertions are done. Called once from
 * the jest setup so no individual test has to remember.
 */
export function clearTestQueryClients(): void {
  clients.splice(0).forEach(client => client.clear());
}
