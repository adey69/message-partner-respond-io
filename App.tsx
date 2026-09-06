/**
 * @format
 */

import { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/data/query/queryClient';
import { startAppStateFocusTracking } from '@/data/query/rnFocus';
import { RootNavigator } from '@/navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { toastConfig } from '@/shared/components/AppToast';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(startAppStateFocusTracking, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <RootNavigator />
          {/* Last, so a toast draws above every screen it reports on. */}
          <Toast config={toastConfig} />
        </SafeAreaProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
