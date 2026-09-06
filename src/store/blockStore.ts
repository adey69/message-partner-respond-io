import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type BlockState = {
  blocked: Record<number, true>;
  toggleBlock: (contactId: number) => void;
};

type Persisted = Pick<BlockState, 'blocked'>;

export const useBlockStore = create<BlockState>()(
  persist(
    set => ({
      blocked: {},

      toggleBlock: contactId =>
        set(state => {
          const blocked = { ...state.blocked };

          if (blocked[contactId] === true) {
            delete blocked[contactId];
          } else {
            blocked[contactId] = true;
          }

          return { blocked };
        }),
    }),
    {
      name: 'messagepartner.blocked',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state): Persisted => ({ blocked: state.blocked }),
    },
  ),
);
