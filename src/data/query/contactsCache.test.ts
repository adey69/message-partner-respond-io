import type { QueryClient } from '@tanstack/react-query';
import { readCachedContact, type ContactsData } from './contactsCache';
import { testQueryClient } from '@test/queryClient';
import { keys } from './keys';
import type { ApiUser } from '@/data/api/types';

const user = (id: number): ApiUser => ({
  id,
  name: `Contact ${id}`,
  username: `contact${id}`,
  email: `contact${id}@example.com`,
  avatar: `https://example.com/${id}.png`,
  phone: `+1-202-555-01${id}`,
  website: `https://contact${id}.example.com`,
  address: { street: 'Street', city: 'City', zipcode: '00000' },
});

const cacheWith = (...pages: ApiUser[][]): QueryClient => {
  const client = testQueryClient();

  client.setQueryData<ContactsData>(keys.contacts(), {
    pages: pages.map((results, index) => ({
      total: pages.flat().length,
      limit: results.length,
      offset: index * results.length,
      results,
    })),
    pageParams: pages.map((_page, index) => index),
  });

  return client;
};

describe('readCachedContact', () => {
  it('finds a contact the list has loaded', () => {
    expect(readCachedContact(cacheWith([user(1), user(2)]), 2)?.name).toBe(
      'Contact 2',
    );
  });

  it('looks past the first page', () => {
    const client = cacheWith([user(1), user(2)], [user(3), user(4)]);

    expect(readCachedContact(client, 4)?.name).toBe('Contact 4');
  });

  it('has no answer for a contact on a page not yet loaded', () => {
    expect(readCachedContact(cacheWith([user(1)]), 60)).toBeUndefined();
  });

  it('has no answer before the list has loaded at all', () => {
    expect(readCachedContact(testQueryClient(), 1)).toBeUndefined();
  });
});
