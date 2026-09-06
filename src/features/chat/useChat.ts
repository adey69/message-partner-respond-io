import { useMemo } from 'react';
import { useSendMessage } from './hooks/useSendMessage';
import { useThread } from './hooks/useThread';
import { buildThreadItems } from './utils/buildThreadItems';
import type { Message } from '@/data/domain/message';
import { useBlockStore } from '@/store/blockStore';
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
  const isBlocked = useBlockStore(state => state.blocked[contactId] === true);
  const { send, retry: retryMessage } = useSendMessage(contactId);

  const items = useMemo(
    () => buildThreadItems([...messages, ...sent]),
    [messages, sent],
  );

  return {
    items,
    isBlocked,
    isPending,
    isError,
    isLoadingMore,
    loadMore,
    retry,
    sendMessage: send,
    retryMessage,
  };
}
