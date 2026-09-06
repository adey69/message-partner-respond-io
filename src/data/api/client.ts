export const BASE_URL = 'https://responserift.dev/api';

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, statusText: string) {
    super(`Request failed with ${status} ${statusText}`);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * `fetch` resolves on 4xx and 5xx, so a failed request has to be turned into a
 * rejection here or React Query will cache the error body as data.
 */
export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, { signal });

  if (!response.ok) {
    throw new ApiError(response.status, response.statusText);
  }

  return (await response.json()) as T;
}
