import { create } from 'zustand';

type BlockState = {
  blocked: Record<number, true>;
  toggleBlock: (contactId: number) => void;
};

export const useBlockStore = create<BlockState>(set => ({
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
}));
