import { useInfiniteQuery } from '@tanstack/react-query';
import { apiGet } from '@/data/api/client';
import { endpoints } from '@/data/api/endpoints';
import { toContact, type Contact } from '@/data/domain/contact';
import type { ContactsData, ContactsPage } from '@/data/query/contactsCache';
import { keys } from '@/data/query/keys';

const PAGE_SIZE = 20;

const getNextPageParam = (lastPage: ContactsPage, allPages: ContactsPage[]) => {
  const loaded = allPages.reduce(
    (count, page) => count + page.results.length,
    0,
  );
  return loaded < lastPage.total ? loaded : undefined;
};

const selectContacts = (data: ContactsData): Contact[] =>
  data.pages.flatMap(page => page.results.map(toContact));

export function useContacts() {
  return useInfiniteQuery({
    queryKey: keys.contacts(),
    queryFn: ({ pageParam, signal }) =>
      apiGet<ContactsPage>(
        endpoints.users({ limit: PAGE_SIZE, offset: pageParam }),
        signal,
      ),
    initialPageParam: 0,
    getNextPageParam,
    select: selectContacts,
  });
}
