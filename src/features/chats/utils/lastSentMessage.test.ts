import { lastSentMessage } from './lastSentMessage';
import type { Message } from '@/data/domain/message';
import type { Outbox } from '@/store/outboxStore';

const message = (id: string): Message => ({
  id,
  body: id,
  sentAt: '2026-09-07T09:00:00.000Z',
  direction: 'outgoing',
});

describe('lastSentMessage', () => {
  it('has nothing to report for a contact never written to', () => {
    expect(lastSentMessage({}, 1)).toBeUndefined();
  });

  it('reports the most recently appended message', () => {
    const outbox: Outbox = { 1: [message('first'), message('second')] };

    expect(lastSentMessage(outbox, 1)?.id).toBe('second');
  });

  it('keeps contacts apart', () => {
    const outbox: Outbox = { 1: [message('one')], 2: [message('two')] };

    expect(lastSentMessage(outbox, 2)?.id).toBe('two');
  });
});
