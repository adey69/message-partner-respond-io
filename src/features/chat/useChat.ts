import { useMemo } from 'react';
import { useSendMessage } from './hooks/useSendMessage';
import { useThread } from './hooks/useThread';
import { buildThreadItems } from './utils/buildThreadItems';
import type { Message } from '@/data/domain/message';
import { useOutboxStore } from '@/store/outboxStore';

const NOT_SENT: Message[] = [];

/**
 * The thread for one contact: what the contact has sent, merged with what this
 * device has sent back. The merge happens at render rather than in the cache,
 * so sent messages outlive a refetch of the fetched half.
 */
export function useChat(contactId: number) {
  const { messages, isPending, isError, isLoadingMore, loadMore, retry } =
    useThread(contactId);
  const sent = useOutboxStore(state => state.messages[contactId] ?? NOT_SENT);
  const { send, retry: retryMessage } = useSendMessage(contactId);

  const items = useMemo(
    () => buildThreadItems([...messages, ...sent]),
    [messages, sent],
  );

  return {
    items,
    isPending,
    isError,
    isLoadingMore,
    loadMore,
    retry,
    sendMessage: send,
    retryMessage,
  };
}
