const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

/**
 * Built once and reused. `toLocaleDateString` constructs a formatter on every
 * call, and these run for every visible row on every render.
 */
const weekday = new Intl.DateTimeFormat(undefined, { weekday: 'short' });
const dayMonth = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'numeric',
});

/** The short relative label shown beside a message preview in the chats list. */
export function formatChatTimestamp(iso: string, now: number = Date.now()): string {
  const then = new Date(iso);
  const elapsed = now - then.getTime();

  if (elapsed < MINUTE) {
    return 'now';
  }
  if (elapsed < HOUR) {
    return `${Math.floor(elapsed / MINUTE)}m`;
  }
  if (elapsed < DAY) {
    return `${Math.floor(elapsed / HOUR)}h`;
  }
  if (elapsed < WEEK) {
    return weekday.format(then);
  }
  return dayMonth.format(then);
}
