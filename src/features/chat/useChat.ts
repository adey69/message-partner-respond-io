import { useCallback, useMemo, useState } from 'react';
import { mockThread } from './mockThread';
import { buildThreadItems } from './utils/buildThreadItems';
import type { Message } from '@/data/domain/message';

/**
 * The thread for one contact. Sent messages are held locally because the API
 * discards writes, so nothing sent here is ever echoed back by the server.
 */
export function useChat(contactId: number) {
  const [sent, setSent] = useState<Message[]>([]);

  const items = useMemo(
    () => buildThreadItems([...mockThread(contactId), ...sent]),
    [contactId, sent],
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

  return { items, sendMessage };
}
