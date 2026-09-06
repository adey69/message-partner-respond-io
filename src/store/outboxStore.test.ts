import { restoreOutbox, useOutboxStore } from './outboxStore';
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

// What comes back from disk is a build older than this one, in the general
// case, so the shape is checked rather than trusted.
describe('restoreOutbox', () => {
  it('settles a message interrupted mid-send so the thread can retry it', () => {
    const restored = restoreOutbox({
      messages: { 1: [message('a'), { ...message('b'), status: 'sent' }] },
    });

    expect(restored[1].map(sent => sent.status)).toEqual(['failed', 'sent']);
  });

  it('keeps every message it restores, in order', () => {
    const restored = restoreOutbox({
      messages: { 7: [message('a'), message('b')] },
    });

    expect(restored[7].map(sent => sent.id)).toEqual(['a', 'b']);
  });

  it.each([
    ['nothing stored', undefined],
    ['an empty entry', {}],
    ['a null map', { messages: null }],
    ['a value of the wrong type', { messages: 'corrupted' }],
  ])('starts empty rather than throwing on %s', (_label, stored) => {
    expect(restoreOutbox(stored)).toEqual({});
  });

  it('drops a malformed contact without losing the ones beside it', () => {
    const restored = restoreOutbox({
      messages: { 1: 'not an array', 2: [message('a')] },
    });

    expect(1 in restored).toBe(false);
    expect(restored[2]).toHaveLength(1);
  });
});
