import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Message, MessageStatus } from '@/data/domain/message';

export type Outbox = Record<number, Message[]>;

type OutboxState = {
  messages: Outbox;
  upsert: (contactId: number, message: Message) => void;
  setStatus: (contactId: number, id: string, status: MessageStatus) => void;
};

type Persisted = Pick<OutboxState, 'messages'>;

export function restoreOutbox(persisted: unknown): Outbox {
  const stored = (persisted as Partial<Persisted> | undefined)?.messages;

  if (stored === null || typeof stored !== 'object') {
    return {};
  }

  const restored: Outbox = {};

  for (const [key, sent] of Object.entries(stored)) {
    const contactId = Number(key);

    if (Number.isNaN(contactId) || !Array.isArray(sent)) {
      continue;
    }

    restored[contactId] = (sent as Message[]).map(message =>
      message.status === 'pending'
        ? { ...message, status: 'failed' as const }
        : message,
    );
  }

  return restored;
}

export const useOutboxStore = create<OutboxState>()(
  persist(
    set => ({
      messages: {},

      upsert: (contactId, message) =>
        set(state => {
          const sent = state.messages[contactId] ?? [];
          const known = sent.some(existing => existing.id === message.id);

          return {
            messages: {
              ...state.messages,
              [contactId]: known
                ? sent.map(existing =>
                    existing.id === message.id ? message : existing,
                  )
                : [...sent, message],
            },
          };
        }),

      setStatus: (contactId, id, status) =>
        set(state => {
          const sent = state.messages[contactId];
          if (sent === undefined) {
            return state;
          }

          return {
            messages: {
              ...state.messages,
              [contactId]: sent.map(message =>
                message.id === id ? { ...message, status } : message,
              ),
            },
          };
        }),
    }),
    {
      name: 'messagepartner.outbox',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state): Persisted => ({ messages: state.messages }),
      merge: (persisted, current) => ({
        ...current,
        messages: restoreOutbox(persisted),
      }),
    },
  ),
);
