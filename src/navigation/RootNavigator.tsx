import { useCallback, useEffect, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';
import { ChatScreen } from '@/features/chat/ChatScreen';
import { ChatHeaderTitle } from '@/features/chat/components/ChatHeaderTitle';
import { ProfileScreen } from '@/features/profile/ProfileScreen';
import { TabNavigator } from './TabNavigator';
import { toNavigationTheme, toStackScreenOptions } from './navigationTheme';
import type { RootStackParamList } from './types';
import { useTheme } from '@/shared/theme/useTheme';
import { useStoresHydrated } from '@/store/hydration';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** The tab bar draws its own headers, so the stack must not add a second one. */
const tabsOptions: NativeStackNavigationOptions = { headerShown: false };

/** A thread is titled by the contact it belongs to. */
const chatOptions = ({
  route,
}: {
  route: RouteProp<RootStackParamList, 'Chat'>;
}): NativeStackNavigationOptions => ({
  title: route.params.contactName,
  headerTitle: () => (
    <ChatHeaderTitle
      contactId={route.params.contactId}
      name={route.params.contactName}
      avatarUrl={route.params.contactAvatarUrl}
    />
  ),
});

export function RootNavigator() {
  const theme = useTheme();
  const navigationTheme = useMemo(() => toNavigationTheme(theme), [theme]);
  const screenOptions = useMemo(() => toStackScreenOptions(theme), [theme]);

  const [isNavigationReady, setNavigationReady] = useState(false);
  const isHydrated = useStoresHydrated();

  const handleReady = useCallback(() => setNavigationReady(true), []);

  // The splash covers the whole JavaScript start-up, so it lifts once there is
  // a finished screen behind it rather than after a guessed delay. That means
  // both halves: a navigator with a screen to show, and client state back from
  // disk, so drafts and blocks are already in place on the first frame.
  useEffect(() => {
    if (isNavigationReady && isHydrated) {
      BootSplash.hide({ fade: true });
    }
  }, [isNavigationReady, isHydrated]);

  return (
    <NavigationContainer theme={navigationTheme} onReady={handleReady}>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          options={tabsOptions}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={chatOptions}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
