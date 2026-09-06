import { buildThreadItems } from './buildThreadItems';
import type { Message, MessageDirection } from '@/data/domain/message';

const START = Date.UTC(2026, 8, 7, 9, 0);

const message = (
  id: string,
  minutes: number,
  direction: MessageDirection,
): Message => ({
  id,
  body: id,
  sentAt: new Date(START + minutes * 60_000).toISOString(),
  direction,
});

const byId = (items: ReturnType<typeof buildThreadItems>) =>
  Object.fromEntries(items.map(item => [item.message.id, item]));

describe('buildThreadItems', () => {
  it('returns an empty thread unchanged', () => {
    expect(buildThreadItems([])).toEqual([]);
  });

  it('returns messages newest first for an inverted list', () => {
    const items = buildThreadItems([
      message('a', 0, 'incoming'),
      message('b', 1, 'incoming'),
    ]);

    expect(items.map(item => item.message.id)).toEqual(['b', 'a']);
  });

  it('always separates the opening message', () => {
    const items = buildThreadItems([message('a', 0, 'incoming')]);

    expect(items[0].separatorLabel).toBeDefined();
  });

  it('separates messages more than an hour apart, and no others', () => {
    const close = buildThreadItems([
      message('a', 0, 'incoming'),
      message('b', 60, 'incoming'),
    ]);
    const apart = buildThreadItems([
      message('a', 0, 'incoming'),
      message('b', 61, 'incoming'),
    ]);

    expect(byId(close).b.separatorLabel).toBeUndefined();
    expect(byId(apart).b.separatorLabel).toBeDefined();
  });

  it('groups a run from one sender and breaks on the other', () => {
    const items = byId(
      buildThreadItems([
        message('a', 0, 'incoming'),
        message('b', 1, 'incoming'),
        message('c', 2, 'outgoing'),
      ]),
    );

    expect(items.a.isGroupStart).toBe(true);
    expect(items.a.isGroupEnd).toBe(false);
    expect(items.b.isGroupStart).toBe(false);
    expect(items.b.isGroupEnd).toBe(true);
    expect(items.c.isGroupStart).toBe(true);
    expect(items.c.isGroupEnd).toBe(true);
  });

  it('starts a new group across a separator from the same sender', () => {
    const items = byId(
      buildThreadItems([
        message('a', 0, 'incoming'),
        message('b', 61, 'incoming'),
      ]),
    );

    expect(items.a.isGroupEnd).toBe(true);
    expect(items.b.isGroupStart).toBe(true);
  });
});

// A thread renders every separator it is given, so an unreadable timestamp
// must produce none rather than an empty one.
describe('an unreadable timestamp', () => {
  it('marks no separator and does not throw', () => {
    const items = buildThreadItems([
      {
        id: 'a',
        body: 'hello',
        sentAt: 'not a date',
        direction: 'incoming',
      },
    ]);

    expect(items[0].separatorLabel).toBeUndefined();
  });
});

