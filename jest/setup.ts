import { EMPTY_PAGE, fetchMock } from './apiMock';
import { clearTestQueryClients } from './queryClient';
import { queryClient } from '@/data/query/queryClient';

// The library ships its own mock, with everything hanging off `default`.
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);

globalThis.fetch = jest.fn();

// Nothing reaches the network in a test. The default is an empty page so a
// screen that fetches without being told what to expect renders its empty
// state rather than throwing.
beforeEach(() => {
  fetchMock().mockReset();
  fetchMock().mockResolvedValue({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => EMPTY_PAGE,
  } as unknown as Response);
});

// Every cached entry schedules its own garbage collection, and the app's own
// client keeps those timers for half an hour — long enough to hold the test
// process open after the last assertion.
afterEach(() => {
  clearTestQueryClients();
  queryClient.clear();
});
