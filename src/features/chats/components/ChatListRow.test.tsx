import { fireEvent, render, screen } from '@testing-library/react-native';
import { ChatListRow } from './ChatListRow';
import { useBlockStore } from '@/store/blockStore';
import { useDraftStore } from '@/store/draftStore';

const CONTACT = {
  id: 1,
  name: 'Carol Martinez',
  avatarUrl: 'https://example.com/3.png',
  lastMessage: 'Sounds good, see you then',
  lastMessageAt: new Date().toISOString(),
};

const renderRow = async (onPress = jest.fn()) => {
  await render(<ChatListRow {...CONTACT} onPress={onPress} />);
  return onPress;
};

beforeEach(() => {
  useBlockStore.setState({ blocked: {} });
  useDraftStore.setState({ drafts: {} });
});

describe('ChatListRow', () => {
  it('shows the contact and their last message', async () => {
    await renderRow();

    expect(screen.getByText(CONTACT.name)).toBeOnTheScreen();
    expect(screen.getByText(CONTACT.lastMessage)).toBeOnTheScreen();
  });

  it('opens the thread with everything the chat header needs', async () => {
    const onPress = await renderRow();

    await fireEvent.press(screen.getByText(CONTACT.name));

    expect(onPress).toHaveBeenCalledWith(
      CONTACT.id,
      CONTACT.name,
      CONTACT.avatarUrl,
    );
  });

  it('prefers an unsent draft over the last message', async () => {
    useDraftStore.getState().setDraft(CONTACT.id, 'on my way');
    await renderRow();

    expect(screen.getByText('Draft: ')).toBeOnTheScreen();
    expect(screen.getByText('on my way')).toBeOnTheScreen();
    expect(screen.queryByText(CONTACT.lastMessage)).not.toBeOnTheScreen();
  });

  it('replaces the preview with an italic notice when blocked', async () => {
    useBlockStore.getState().toggleBlock(CONTACT.id);
    await renderRow();

    expect(screen.queryByText(CONTACT.lastMessage)).not.toBeOnTheScreen();
    expect(screen.getByText('This user is blocked.')).toHaveStyle({
      fontStyle: 'italic',
    });
  });

  it('reports no time for a blocked contact', async () => {
    useBlockStore.getState().toggleBlock(CONTACT.id);
    await renderRow();

    expect(screen.queryByText(/·/)).not.toBeOnTheScreen();
  });

  // Blocking hides the composer, so a draft written beforehand can no longer
  // be sent and the row stops advertising it.
  it('drops a draft it can no longer send once blocked', async () => {
    useDraftStore.getState().setDraft(CONTACT.id, 'on my way');
    useBlockStore.getState().toggleBlock(CONTACT.id);
    await renderRow();

    expect(screen.queryByText('Draft: ')).not.toBeOnTheScreen();
    expect(screen.getByText('This user is blocked.')).toBeOnTheScreen();
  });
});
