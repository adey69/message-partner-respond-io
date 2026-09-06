import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet } from '@/data/api/client';
import { endpoints } from '@/data/api/endpoints';
import type { ApiUser } from '@/data/api/types';
import { toContact } from '@/data/domain/contact';
import { readCachedContact } from '@/data/query/contactsCache';
import { keys } from '@/data/query/keys';
import { CACHE_POLICY } from '@/data/query/queryClient';

export function useContact(contactId: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: keys.contact(contactId),
    queryFn: ({ signal }) => apiGet<ApiUser>(endpoints.user(contactId), signal),
    placeholderData: () => readCachedContact(queryClient, contactId),
    select: toContact,
    // As with a thread, one per contact visited rather than one per app.
    gcTime: CACHE_POLICY.perContactGcTime,
  });
}
