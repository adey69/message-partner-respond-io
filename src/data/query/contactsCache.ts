import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import type { ApiListResponse, ApiUser } from '@/data/api/types';
import { keys } from './keys';

export type ContactsPage = ApiListResponse<ApiUser>;

export type ContactsData = InfiniteData<ContactsPage, number>;

/**
 * A contact from the pages the chats list has already loaded, so a screen
 * opened from that list can render before its own request answers.
 *
 * The search stops at the first match rather than flattening the pages, so it
 * costs no more as the list grows deeper.
 */
export function readCachedContact(
  client: QueryClient,
  contactId: number,
): ApiUser | undefined {
  const cached = client.getQueryData<ContactsData>(keys.contacts());

  for (const page of cached?.pages ?? []) {
    const match = page.results.find(user => user.id === contactId);
    if (match !== undefined) {
      return match;
    }
  }

  return undefined;
}
