import { useColorScheme } from 'react-native';
import { themes, type Theme } from './tokens';

/** Resolves the active theme from the OS appearance setting. */
export function useTheme(): Theme {
  return themes[useColorScheme() === 'dark' ? 'dark' : 'light'];
}
