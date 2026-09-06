import { useDraftStore } from './draftStore';

const drafts = () => useDraftStore.getState().drafts;

beforeEach(() => useDraftStore.setState({ drafts: {} }));

describe('draftStore', () => {
  it('holds a draft against the contact it was typed for', () => {
    useDraftStore.getState().setDraft(1, 'hello');

    expect(drafts()[1]).toBe('hello');
    expect(drafts()[2]).toBeUndefined();
  });

  // An emptied input has no draft, so the row falls back to its preview
  // instead of showing an empty "Draft:" line.
  it('drops the entry when the input is emptied', () => {
    useDraftStore.getState().setDraft(1, 'hello');
    useDraftStore.getState().setDraft(1, '');

    expect(1 in drafts()).toBe(false);
  });
});
