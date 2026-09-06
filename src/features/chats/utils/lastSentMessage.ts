import type { Message } from '@/data/domain/message';
import type { Outbox } from '@/store/outboxStore';

/** The most recent message sent to a contact from this device. */
export function lastSentMessage(
  outbox: Outbox,
  contactId: number,
): Message | undefined {
  const sent = outbox[contactId];
  return sent === undefined ? undefined : sent[sent.length - 1];
}
