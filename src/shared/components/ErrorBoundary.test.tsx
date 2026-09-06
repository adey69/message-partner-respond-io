import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ErrorBoundary } from './ErrorBoundary';

const Boom = ({ throws }: { throws: boolean }) => {
  if (throws) {
    throw new Error('render blew up');
  }
  return <Text>Working screen</Text>;
};

// React logs a caught error itself, and the boundary logs its own report.
// Neither is a failure, so the noise is muted rather than read.
beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());

describe('ErrorBoundary', () => {
  it('renders its children while nothing throws', async () => {
    await render(
      <ErrorBoundary>
        <Boom throws={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Working screen')).toBeTruthy();
  });

  it('shows the fallback instead of unmounting the tree', async () => {
    await render(
      <ErrorBoundary>
        <Boom throws />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeTruthy();
  });

  it('reports the error rather than swallowing it', async () => {
    await render(
      <ErrorBoundary>
        <Boom throws />
      </ErrorBoundary>,
    );

    expect(console.error).toHaveBeenCalledWith(
      'Unhandled render error',
      expect.objectContaining({ message: 'render blew up' }),
      expect.anything(),
    );
  });

  // Retrying re-renders the children, so a screen that threw on a transient
  // condition comes back rather than staying broken until a restart.
  it('renders the children again when the fallback is retried', async () => {
    const { rerender } = await render(
      <ErrorBoundary>
        <Boom throws />
      </ErrorBoundary>,
    );

    rerender(
      <ErrorBoundary>
        <Boom throws={false} />
      </ErrorBoundary>,
    );
    fireEvent.press(screen.getByText('Try again'));

    expect(screen.getByText('Working screen')).toBeTruthy();
  });
});
