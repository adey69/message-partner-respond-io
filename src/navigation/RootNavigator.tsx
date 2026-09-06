import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { ChatScreen } from '@/features/chat/ChatScreen';
import { ChatHeaderTitle } from '@/features/chat/components/ChatHeaderTitle';
import { ProfileScreen } from '@/features/profile/ProfileScreen';
import { TabNavigator } from './TabNavigator';
import { toNavigationTheme } from './navigationTheme';
import type { RootStackParamList } from './types';
import { useTheme } from '@/shared/theme/useTheme';

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

  return (
    <NavigationContainer theme={toNavigationTheme(theme)}>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={TabNavigator} options={tabsOptions} />
        <Stack.Screen name="Chat" component={ChatScreen} options={chatOptions} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
