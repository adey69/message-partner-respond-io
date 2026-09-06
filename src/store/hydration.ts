import { useSyncExternalStore } from 'react';
import { useBlockStore } from './blockStore';
import { useDraftStore } from './draftStore';
import { useOutboxStore } from './outboxStore';

/**
 * Zustand's persist middleware reads from disk asynchronously and exposes the
 * progress on `store.persist`. It ships no gate component of its own, so this
 * is the documented `hasHydrated` check, widened to cover every persisted
 * store at once.
 */
const stores = [useBlockStore, useDraftStore, useOutboxStore];

const subscribe = (onStoreChange: () => void) => {
  const stops = stores.map(store =>
    store.persist.onFinishHydration(onStoreChange),
  );
  return () => stops.forEach(stop => stop());
};

const hasHydrated = () => stores.every(store => store.persist.hasHydrated());

/**
 * Whether every persisted store has finished reading from disk. A screen
 * rendered before that shows an empty outbox and no blocks for a frame or two,
 * which reads as data loss on the launch after a send, so the splash stays up
 * until this turns true.
 */
export function useStoresHydrated(): boolean {
  return useSyncExternalStore(subscribe, hasHydrated);
}
