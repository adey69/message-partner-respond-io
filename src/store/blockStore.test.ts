import { useBlockStore } from './blockStore';

const blocked = () => useBlockStore.getState().blocked;

beforeEach(() => useBlockStore.setState({ blocked: {} }));

describe('blockStore', () => {
  it('starts with nobody blocked', () => {
    expect(blocked()[1]).toBeUndefined();
  });

  it('blocks a contact and unblocks them again', () => {
    useBlockStore.getState().toggleBlock(1);
    expect(blocked()[1]).toBe(true);

    useBlockStore.getState().toggleBlock(1);
    expect(blocked()[1]).toBeUndefined();
  });

  it('blocks one contact without touching another', () => {
    useBlockStore.getState().toggleBlock(1);

    expect(blocked()[1]).toBe(true);
    expect(blocked()[2]).toBeUndefined();
  });
});
