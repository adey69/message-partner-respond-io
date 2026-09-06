import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type DraftState = {
  drafts: Record<number, string>;
  setDraft: (contactId: number, body: string) => void;
};

type Persisted = Pick<DraftState, 'drafts'>;

export const useDraftStore = create<DraftState>()(
  persist(
    set => ({
      drafts: {},
      setDraft: (contactId, body) =>
        set(state => {
          const drafts = { ...state.drafts };
          if (body === '') {
            delete drafts[contactId];
          } else {
            drafts[contactId] = body;
          }
          return { drafts };
        }),
    }),
    {
      name: 'messagepartner.drafts',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state): Persisted => ({ drafts: state.drafts }),
    },
  ),
);
