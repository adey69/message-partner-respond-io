import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import { apiGet } from '@/data/api/client';
import { endpoints } from '@/data/api/endpoints';
import type { ApiListResponse, ApiUser } from '@/data/api/types';
import { toContact, type Contact } from '@/data/domain/contact';
import { keys } from '@/data/query/keys';

const PAGE_SIZE = 20;

type UsersPage = ApiListResponse<ApiUser>;

const getNextPageParam = (lastPage: UsersPage, allPages: UsersPage[]) => {
  const loaded = allPages.reduce(
    (count, page) => count + page.results.length,
    0,
  );
  return loaded < lastPage.total ? loaded : undefined;
};

const selectContacts = (data: InfiniteData<UsersPage>): Contact[] =>
  data.pages.flatMap(page => page.results.map(toContact));

export function useContacts() {
  return useInfiniteQuery({
    queryKey: keys.contacts(),
    queryFn: ({ pageParam, signal }) =>
      apiGet<UsersPage>(
        endpoints.users({ limit: PAGE_SIZE, offset: pageParam }),
        signal,
      ),
    initialPageParam: 0,
    getNextPageParam,
    select: selectContacts,
  });
}
