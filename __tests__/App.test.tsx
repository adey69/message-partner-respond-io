/**
 * @format
 */

import { render, screen } from '@testing-library/react-native';
import App from '../App';

// A smoke test, and deliberately nothing more: it proves the module graph
// loads and the providers and navigator mount without throwing. What each
// screen actually renders is covered by the tests beside that feature.
test('boots without crashing', async () => {
  await render(<App />);

  expect(screen.toJSON()).not.toBeNull();
});
