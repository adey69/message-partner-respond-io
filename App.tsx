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
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(startAppStateFocusTracking, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <RootNavigator />
        </SafeAreaProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
