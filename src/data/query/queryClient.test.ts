import { ApiError } from '@/data/api/client';
import { shouldRetry } from './queryClient';

describe('shouldRetry', () => {
  it.each([
    ['a not found', 404],
    ['a bad request', 400],
    ['a rate limit', 429],
  ])('does not ask again after %s', (_label, status) => {
    expect(shouldRetry(0, new ApiError(status, 'nope'))).toBe(false);
  });

  it('asks again after a server error, which may not repeat', () => {
    expect(shouldRetry(0, new ApiError(500, 'oops'))).toBe(true);
  });

  it('asks again after a transport failure', () => {
    expect(shouldRetry(0, new TypeError('Network request failed'))).toBe(true);
  });

  it('gives up rather than retrying forever', () => {
    expect(shouldRetry(1, new ApiError(500, 'oops'))).toBe(false);
  });
});
