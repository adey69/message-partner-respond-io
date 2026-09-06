/**
 * The network boundary. Tests stub what the server answers and let every layer
 * above it — the client, React Query, the mappers, the stores — run for real.
 */

const jsonResponse = (body: unknown, status: number): Response =>
  ({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: async () => body,
  } as unknown as Response);

export const fetchMock = (): jest.MockedFunction<typeof fetch> =>
  globalThis.fetch as jest.MockedFunction<typeof fetch>;

/** Answers the next request, whatever its URL, with this body. */
export const respondWith = (body: unknown, status = 200): void => {
  fetchMock().mockResolvedValueOnce(jsonResponse(body, status));
};

/** Fails the next request the way a dropped connection does. */
export const failNextRequest = (): void => {
  fetchMock().mockRejectedValueOnce(new Error('Network request failed'));
};

export const EMPTY_PAGE = { total: 0, limit: 20, offset: 0, results: [] };
