import { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import type { Contact } from '@/data/domain/contact';
import { keys } from '@/data/query/keys';
import { useContacts, type ContactsData } from './hooks/useContacts';
import {
  placeholderMessage,
  type PlaceholderMessage,
} from './utils/placeholderMessage';

export type ChatListItem = Contact & PlaceholderMessage;

export function useChats() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const {
    data,
    isPending,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useContacts();

  const chats: ChatListItem[] = useMemo(
    () =>
      (data ?? []).map(contact => ({
        ...contact,
        ...placeholderMessage(contact.id),
      })),
    [data],
  );

  const openChat = useCallback(
    (contactId: number, contactName: string) => {
      navigation.navigate('Chat', { contactId, contactName });
    },
    [navigation],
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const refresh = useCallback(() => {
    queryClient.setQueryData<ContactsData>(keys.contacts(), current =>
      current === undefined
        ? current
        : {
            pages: current.pages.slice(0, 1),
            pageParams: current.pageParams.slice(0, 1),
          },
    );
    refetch();
  }, [queryClient, refetch]);

  return {
    chats,
    isPending,
    isError,
    isRefreshing: isRefetching && !isFetchingNextPage,
    isFetchingNextPage,
    openChat,
    loadMore,
    refresh,
  };
}
