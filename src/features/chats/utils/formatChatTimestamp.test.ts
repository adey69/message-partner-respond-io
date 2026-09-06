import { formatChatTimestamp } from './formatChatTimestamp';

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

const NOW = new Date('2026-09-07T12:00:00Z').getTime();
const ago = (ms: number) => new Date(NOW - ms).toISOString();

describe('formatChatTimestamp', () => {
  it('reads as now for anything under a minute', () => {
    expect(formatChatTimestamp(ago(0), NOW)).toBe('now');
    expect(formatChatTimestamp(ago(MINUTE - 1), NOW)).toBe('now');
  });

  it('counts whole minutes up to an hour', () => {
    expect(formatChatTimestamp(ago(MINUTE), NOW)).toBe('1m');
    expect(formatChatTimestamp(ago(90 * 1000), NOW)).toBe('1m');
    expect(formatChatTimestamp(ago(HOUR - 1), NOW)).toBe('59m');
  });

  it('counts whole hours up to a day', () => {
    expect(formatChatTimestamp(ago(HOUR), NOW)).toBe('1h');
    expect(formatChatTimestamp(ago(DAY - 1), NOW)).toBe('23h');
  });

  // The last two branches hand off to Intl, so these assert that the branch
  // changed at the boundary rather than restating what a locale renders.
  it('gives up counting hours at a day old', () => {
    expect(formatChatTimestamp(ago(DAY), NOW)).not.toMatch(/^\d+h$/);
  });

  it('switches from a weekday to a calendar date at a week old', () => {
    expect(formatChatTimestamp(ago(WEEK), NOW)).not.toBe(
      formatChatTimestamp(ago(WEEK - DAY), NOW),
    );
    expect(formatChatTimestamp(ago(WEEK), NOW)).toMatch(/\d/);
  });
});

// `Intl` throws a RangeError on an invalid date rather than formatting it, so
// an unreadable timestamp has to stop here or it takes down the row.
describe('an unreadable timestamp', () => {
  it.each([
    ['a malformed string', 'not a date'],
    ['an empty string', ''],
  ])('has no label for %s', (_label, iso) => {
    expect(() => formatChatTimestamp(iso)).not.toThrow();
    expect(formatChatTimestamp(iso)).toBe('');
  });
});

