import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useContacts } from './hooks/useContacts';

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
    contacts: data ?? [],
    isPending,
    isError,
    isRefreshing: isRefetching && !isFetchingNextPage,
    isFetchingNextPage,
    openChat,
    loadMore,
    refresh,
  };
}
