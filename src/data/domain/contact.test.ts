import { toContact } from './contact';
import type { ApiUser } from '@/data/api/types';

const user = (overrides: Partial<ApiUser>): ApiUser =>
  ({
    id: 1,
    name: 'Alice Johnson',
    avatar: 'https://example.com/1.png',
    phone: '555-0100',
    ...overrides,
  }) as ApiUser;

describe('toContact', () => {
  it('carries a complete user through unchanged', () => {
    expect(toContact(user({}))).toEqual({
      id: 1,
      name: 'Alice Johnson',
      avatarUrl: 'https://example.com/1.png',
      phone: '555-0100',
    });
  });

  // A component calls string methods on these, so an absent one is a crash
  // rather than a blank. The mapper is where the response stops being trusted.
  it.each([
    ['undefined', undefined],
    ['null', null],
    ['empty', ''],
    ['whitespace', '   '],
  ])('names a contact whose name is %s', (_label, name) => {
    expect(toContact(user({ name: name as string })).name).toBe(
      'Unknown contact',
    );
  });

  it('falls back to an empty avatar rather than an absent one', () => {
    expect(toContact(user({ avatar: undefined })).avatarUrl).toBe('');
  });

  it('falls back to an empty phone rather than an absent one', () => {
    expect(toContact(user({ phone: undefined })).phone).toBe('');
  });
});
