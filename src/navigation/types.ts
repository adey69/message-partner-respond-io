import type { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Chats: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  Chat: { contactId: number; contactName: string };
  Profile: { contactId: number };
};

/**
 * Registers the root param list with React Navigation so `useNavigation()` is
 * typed everywhere without each caller restating the generic.
 */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
