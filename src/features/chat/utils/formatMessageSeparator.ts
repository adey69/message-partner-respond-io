const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const DAYS_IN_WEEK = 7;

const clock = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
});
const weekday = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
const fullDate = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/**
 * The date and time label marking a jump in time between two messages. A
 */
export function formatMessageSeparator(
  iso: string,
  now: number = Date.now(),
): string {
  const then = new Date(iso);

  if (Number.isNaN(then.getTime())) {
    return '';
  }

  const time = clock.format(then);
  const daysApart = Math.round(
    (startOfDay(new Date(now)) - startOfDay(then)) / DAY,
  );

  if (daysApart === 0) {
    return `Today ${time}`;
  }
  if (daysApart === 1) {
    return `Yesterday ${time}`;
  }
  if (daysApart < DAYS_IN_WEEK) {
    return `${weekday.format(then)} ${time}`;
  }
  return `${fullDate.format(then)} ${time}`;
}
