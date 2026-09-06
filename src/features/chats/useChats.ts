import { useCallback, useMemo } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import type { Contact } from '@/data/domain/contact';
import type { ContactsData } from '@/data/query/contactsCache';
import { keys } from '@/data/query/keys';
import { useContacts } from './hooks/useContacts';
import { startClock } from './hooks/useRelativeTime';
import { lastSentMessage } from './utils/lastSentMessage';
import {
  placeholderMessage,
  type PlaceholderMessage,
} from './utils/placeholderMessage';
import { useOutboxStore } from '@/store/outboxStore';

export type ChatListItem = Contact & PlaceholderMessage;

export function useChats() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const outbox = useOutboxStore(state => state.messages);

  // Relative row timestamps go stale unless something re-renders them. This
  // drives a clock, not a refetch; the query is untouched.
  useFocusEffect(startClock);

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

  // Only contacts written to are reordered: sorting the whole list would
  // reshuffle it whenever a page lands, and would cost more the longer it
  // grows. Partitioning keeps that cost tied to the outbox instead.
  const chats: ChatListItem[] = useMemo(() => {
    const messaged: ChatListItem[] = [];
    const rest: ChatListItem[] = [];

    for (const contact of data ?? []) {
      const sent = lastSentMessage(outbox, contact.id);

      if (sent === undefined) {
        rest.push({ ...contact, ...placeholderMessage(contact.id) });
      } else {
        messaged.push({
          ...contact,
          lastMessage: sent.body,
          lastMessageAt: sent.sentAt,
        });
      }
    }

    messaged.sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
    return messaged.concat(rest);
  }, [data, outbox]);

  const openChat = useCallback(
    (contactId: number, contactName: string, contactAvatarUrl: string) => {
      navigation.navigate('Chat', { contactId, contactName, contactAvatarUrl });
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
