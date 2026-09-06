import { useCallback } from 'react';
import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import { apiGet } from '@/data/api/client';
import { endpoints } from '@/data/api/endpoints';
import type { ApiListResponse, ApiPost } from '@/data/api/types';
import { toMessage, type Message } from '@/data/domain/message';
import { keys } from '@/data/query/keys';

const PAGE_SIZE = 20;

const NO_MESSAGES: Message[] = [];

type PostsPage = ApiListResponse<ApiPost>;

type ThreadData = InfiniteData<PostsPage, number>;

const oldestFirst = (a: Message, b: Message) => a.sentAt.localeCompare(b.sentAt);

const selectThread = (data: ThreadData): Message[] =>
  data.pages.flatMap(page => page.results.map(toMessage)).sort(oldestFirst);

const getNextPageParam = (lastPage: PostsPage, allPages: PostsPage[]) => {
  const loaded = allPages.reduce(
    (count, page) => count + page.results.length,
    0,
  );
  return loaded < lastPage.total ? loaded : undefined;
};

/** One contact's inbound messages. */
export function useThread(contactId: number) {
  const thread = useInfiniteQuery({
    queryKey: keys.thread(contactId),
    queryFn: ({ pageParam, signal }) =>
      apiGet<PostsPage>(
        endpoints.posts({
          userId: contactId,
          limit: PAGE_SIZE,
          offset: pageParam,
        }),
        signal,
      ),
    initialPageParam: 0,
    getNextPageParam,
    select: selectThread,
  });

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = thread;

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    messages: thread.data ?? NO_MESSAGES,
    isPending: thread.isPending,
    isError: thread.isError,
    isLoadingMore: isFetchingNextPage,
    loadMore,
    retry: thread.refetch,
  };
}
