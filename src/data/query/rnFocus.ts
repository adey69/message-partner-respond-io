import { AppState, type AppStateStatus } from 'react-native';
import { focusManager } from '@tanstack/react-query';

/**
 * React Query decides an app is "focused" using browser window events, which
 * never fire in React Native. Without this bridge `refetchOnWindowFocus` is
 * silently dead.
 *
 * This tracks the app moving between background and foreground. It is unrelated
 * to React Navigation — changing screen or tab does not change AppState.
 */
export function startAppStateFocusTracking(): () => void {
  const subscription = AppState.addEventListener('change', (status: AppStateStatus) => {
    focusManager.setFocused(status === 'active');
  });

  return () => subscription.remove();
}
