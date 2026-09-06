import { create } from 'zustand';

type DraftState = {
  drafts: Record<number, string>;
  setDraft: (contactId: number, body: string) => void;
};

export const useDraftStore = create<DraftState>(set => ({
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
}));
