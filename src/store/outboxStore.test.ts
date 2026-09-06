import { useOutboxStore } from './outboxStore';
import type { Message } from '@/data/domain/message';

const message = (id: string, body = id): Message => ({
  id,
  body,
  sentAt: '2026-09-07T09:00:00.000Z',
  direction: 'outgoing',
  status: 'pending',
});

const outbox = () => useOutboxStore.getState().messages;

// The store is a module singleton, so each test starts from an empty one.
beforeEach(() => useOutboxStore.setState({ messages: {} }));

describe('outboxStore', () => {
  it('appends a message to the contact it was sent to', () => {
    useOutboxStore.getState().upsert(1, message('a'));

    expect(outbox()[1].map(sent => sent.id)).toEqual(['a']);
    expect(outbox()[2]).toBeUndefined();
  });

  it('replaces a message it has already seen rather than duplicating it', () => {
    useOutboxStore.getState().upsert(1, message('a', 'first'));
    useOutboxStore.getState().upsert(1, message('a', 'second'));

    expect(outbox()[1]).toHaveLength(1);
    expect(outbox()[1][0].body).toBe('second');
  });

  it('keeps a replaced message in its original place', () => {
    useOutboxStore.getState().upsert(1, message('a'));
    useOutboxStore.getState().upsert(1, message('b'));
    useOutboxStore.getState().upsert(1, message('a', 'edited'));

    expect(outbox()[1].map(sent => sent.id)).toEqual(['a', 'b']);
  });

  it('moves only the addressed message to a new status', () => {
    useOutboxStore.getState().upsert(1, message('a'));
    useOutboxStore.getState().upsert(1, message('b'));
    useOutboxStore.getState().setStatus(1, 'a', 'sent');

    expect(outbox()[1][0].status).toBe('sent');
    expect(outbox()[1][1].status).toBe('pending');
  });

  it('ignores a status for a contact it holds nothing for', () => {
    const before = outbox();
    useOutboxStore.getState().setStatus(99, 'a', 'failed');

    expect(outbox()).toBe(before);
  });
});
