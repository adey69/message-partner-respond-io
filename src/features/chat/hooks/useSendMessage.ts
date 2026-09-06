import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiPost } from '@/data/api/client';
import { endpoints } from '@/data/api/endpoints';
import type { ApiNewPost, ApiPost } from '@/data/api/types';
import type { Message } from '@/data/domain/message';
import { useOutboxStore } from '@/store/outboxStore';

const MESSAGE_TITLE = 'Message';

let sequence = 0;

const nextId = () => {
  sequence += 1;
  return `local-${Date.now()}-${sequence}`;
};

/**
 * Sends a message and tracks what became of it. The message reaches the outbox
 * before the request goes out, so it is on screen straight away and the
 * response only ever moves its status.
 *
 * The created post that comes back is discarded. Every call is answered with
 * the same fabricated id, so adopting it would give every sent message the
 * same key.
 */
export function useSendMessage(contactId: number) {
  const upsert = useOutboxStore(state => state.upsert);
  const setStatus = useOutboxStore(state => state.setStatus);

  const { mutate } = useMutation({
    mutationFn: (message: Message) =>
      apiPost<ApiPost>(endpoints.createPost(), {
        userId: contactId,
        title: MESSAGE_TITLE,
        body: message.body,
      } satisfies ApiNewPost),
    onMutate: message => upsert(contactId, { ...message, status: 'pending' }),
    onSuccess: (_post, message) => setStatus(contactId, message.id, 'sent'),
    onError: (_error, message) => setStatus(contactId, message.id, 'failed'),
  });

  const send = useCallback(
    (body: string) =>
      mutate({
        id: nextId(),
        body,
        sentAt: new Date().toISOString(),
        direction: 'outgoing',
        status: 'pending',
      }),
    [mutate],
  );

  /** Resends an existing outbox entry, which reuses its id and its place. */
  const retry = useCallback(
    (id: string) => {
      const message = useOutboxStore
        .getState()
        .messages[contactId]?.find(sent => sent.id === id);

      if (message !== undefined) {
        mutate(message);
      }
    },
    [mutate, contactId],
  );

  return { send, retry };
}
