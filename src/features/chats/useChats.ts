import { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { Contact } from '@/data/domain/contact';
import { useContacts } from './hooks/useContacts';
import { placeholderMessage, type PlaceholderMessage } from './utils/placeholderMessage';

export type ChatListItem = Contact & PlaceholderMessage;

export function useChats() {
  const navigation = useNavigation();
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
    () => (data ?? []).map(contact => ({ ...contact, ...placeholderMessage(contact.id) })),
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
    refetch();
  }, [refetch]);

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
