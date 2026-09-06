import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { ProfileScreen } from './ProfileScreen';
import { failNextRequest, respondWith } from '@test/apiMock';
import { renderWithProviders } from '@test/renderWithProviders';
import { useBlockStore } from '@/store/blockStore';

const CONTACT_ID = 3;

const CAROL = {
  id: CONTACT_ID,
  name: 'Carol Martinez',
  username: 'carolm',
  email: 'carol.martinez@example.com',
  avatar: 'https://example.com/3.png',
  phone: '+1-202-555-0303',
  website: 'https://carolm.example.com',
  address: { street: '789 Pine Rd', city: 'Greenville', zipcode: '29601' },
};

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({ params: { contactId: 3 } }),
}));

beforeEach(() => useBlockStore.setState({ blocked: {} }));

describe('ProfileScreen', () => {
  it('shows the contact the API answers with', async () => {
    respondWith(CAROL);
    await renderWithProviders(<ProfileScreen />);

    expect(await screen.findByText(CAROL.name)).toBeOnTheScreen();
    expect(screen.getByText(CAROL.phone)).toBeOnTheScreen();
  });

  it('offers a retry when there is nothing to show', async () => {
    failNextRequest();
    await renderWithProviders(<ProfileScreen />);

    expect(await screen.findByText('Could not load profile')).toBeOnTheScreen();
    expect(screen.getByText('Try again')).toBeOnTheScreen();
  });

  it('blocks and unblocks the contact', async () => {
    respondWith(CAROL);
    await renderWithProviders(<ProfileScreen />);
    await screen.findByText(CAROL.name);

    await fireEvent.press(screen.getByText('Block'));

    await waitFor(() => expect(screen.getByText('Unblock')).toBeOnTheScreen());
    expect(screen.getByText(/You blocked Carol Martinez/)).toBeOnTheScreen();
    expect(useBlockStore.getState().blocked[CONTACT_ID]).toBe(true);

    await fireEvent.press(screen.getByText('Unblock'));

    await waitFor(() => expect(screen.getByText('Block')).toBeOnTheScreen());
    expect(useBlockStore.getState().blocked[CONTACT_ID]).toBeUndefined();
  });
});
