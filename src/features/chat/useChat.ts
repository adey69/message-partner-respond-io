import { useCallback, useMemo, useState } from 'react';
import { useThread } from './hooks/useThread';
import { buildThreadItems } from './utils/buildThreadItems';
import type { Message } from '@/data/domain/message';

/**
 * The thread for one contact. Sent messages are held alongside the fetched
 * ones because the API discards writes, so nothing sent here is ever echoed
 * back by the server.
 */
export function useChat(contactId: number) {
  const [sent, setSent] = useState<Message[]>([]);
  const { messages, isPending, isError, isLoadingMore, loadMore, retry } =
    useThread(contactId);

  const items = useMemo(
    () => buildThreadItems([...messages, ...sent]),
    [messages, sent],
  );

  const sendMessage = useCallback((body: string) => {
    setSent(current => [
      ...current,
      {
        id: `local-${Date.now()}`,
        body,
        sentAt: new Date().toISOString(),
        direction: 'outgoing',
        status: 'sent',
      },
    ]);
  }, []);

  return {
    items,
    isPending,
    isError,
    isLoadingMore,
    loadMore,
    retry,
    sendMessage,
  };
}
