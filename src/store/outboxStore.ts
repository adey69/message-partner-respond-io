import { create } from 'zustand';
import type { Message, MessageStatus } from '@/data/domain/message';

export type Outbox = Record<number, Message[]>;

type OutboxState = {
  messages: Outbox;
  upsert: (contactId: number, message: Message) => void;
  setStatus: (contactId: number, id: string, status: MessageStatus) => void;
};

export const useOutboxStore = create<OutboxState>(set => ({
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
}));
