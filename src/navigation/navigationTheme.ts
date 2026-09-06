import {
  DarkTheme,
  DefaultTheme,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { Theme } from '@/shared/theme/tokens';

/**
 * Maps app tokens onto the palette React Navigation uses for the chrome it
 * draws itself — headers, tab bar, screen background and back-gesture surfaces.
 * Without this the navigator keeps its own defaults and only the screen bodies
 * follow the theme.
 */
export function toNavigationTheme(theme: Theme): NavigationTheme {
  const base = theme.scheme === 'dark' ? DarkTheme : DefaultTheme;

  return {
    ...base,
    colors: {
      ...base.colors,
      primary: theme.colors.accent,
      background: theme.colors.background,
      card: theme.colors.background,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.danger,
    },
  };
}

/**
 * Header options for the screens pushed on top of the tabs.
 *
 * The back control shows its chevron alone. Left to itself iOS labels it with
 * the previous screen's title, which here is the navigator's own route name.
 * The chevron also takes the header's text colour rather than the accent, so
 * it reads as part of the header instead of as a link.
 */
export function toStackScreenOptions(
  theme: Theme,
): NativeStackNavigationOptions {
  return {
    headerStyle: { backgroundColor: theme.colors.background },
    headerTintColor: theme.colors.text,
    headerTitleAlign: 'left',
    headerBackButtonDisplayMode: 'minimal',
    headerTitleStyle: {
      color: theme.colors.text,
      fontSize: theme.fontSize.subtitle,
      fontWeight: theme.fontWeight.semibold,
    },
  };
}
