import { create } from 'zustand';
import { formatChatTimestamp } from '../utils/formatChatTimestamp';

const TICK_MS = 60_000;

type ClockState = {
  now: number;
};

const useClockStore = create<ClockState>(() => ({ now: Date.now() }));

let watchers = 0;
let timer: ReturnType<typeof setInterval> | undefined;

/**
 * Starts the shared clock and returns this caller's stop. Counting callers
 * keeps one interval however many screens are watching, and leaves none
 * running once the last of them looks away.
 */
export function startClock(): () => void {
  watchers += 1;
  useClockStore.setState({ now: Date.now() });

  if (timer === undefined) {
    timer = setInterval(
      () => useClockStore.setState({ now: Date.now() }),
      TICK_MS,
    );
  }

  let stopped = false;

  return () => {
    if (stopped) {
      return;
    }

    stopped = true;
    watchers -= 1;

    if (watchers === 0 && timer !== undefined) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

/**
 * A timestamp's label, kept current while the clock runs. The store compares
 * the label rather than the clock reading, so a row re-renders only when its
 * own text changes — one showing a calendar date never does.
 */
export function useRelativeTime(iso: string): string {
  return useClockStore(state => formatChatTimestamp(iso, state.now));
}
