import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CommentDotsRegular from '@/assets/icons/comment-dots-regular.svg';
import CommentDotsSolid from '@/assets/icons/comment-dots-solid.svg';
import GearRegular from '@/assets/icons/gear-regular.svg';
import GearSolid from '@/assets/icons/gear-solid.svg';
import { ChatsScreen } from '@/features/chats/ChatsScreen';
import { SettingsScreen } from '@/features/settings/SettingsScreen';
import type { TabParamList } from '@/navigation/types';
import { useTheme } from '@/shared/theme/useTheme';

type TabIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

const Tab = createBottomTabNavigator<TabParamList>();

/**
 * The selected tab uses the solid weight and the rest the regular outline,
 * so the active tab reads at a glance even in monochrome.
 *
 * Declared at module scope so each tab keeps the same icon component type
 * across renders; an inline arrow would remount the icon every time.
 */
const renderChatsIcon = ({ focused, color, size }: TabIconProps) => {
  const Icon = focused ? CommentDotsSolid : CommentDotsRegular;
  return <Icon width={size} height={size} color={color} />;
};

const renderSettingsIcon = ({ focused, color, size }: TabIconProps) => {
  const Icon = focused ? GearSolid : GearRegular;
  return <Icon width={size} height={size} color={color} />;
};

export function TabNavigator() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: { fontSize: theme.fontSize.caption },
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        headerStyle: { backgroundColor: theme.colors.background },
        headerTitleStyle: {
          color: theme.colors.text,
          fontSize: theme.fontSize.title,
          fontWeight: theme.fontWeight.semibold,
        },
      }}>
      <Tab.Screen
        name="Chats"
        component={ChatsScreen}
        options={{ tabBarIcon: renderChatsIcon }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: renderSettingsIcon }}
      />
    </Tab.Navigator>
  );
}
