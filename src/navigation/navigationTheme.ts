import {
  DarkTheme,
  DefaultTheme,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
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
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.danger,
    },
  };
}
