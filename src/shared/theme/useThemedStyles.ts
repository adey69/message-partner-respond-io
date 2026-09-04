import { useTheme } from '@/shared/theme/useTheme';
import type { Theme } from '@/shared/theme/tokens';

type StyleFactory<T> = (theme: Theme) => T;

/**
 * Results are cached per factory per theme, so a list of sixty rows sharing one
 * factory builds its StyleSheet once rather than once per row.
 */
const cache = new WeakMap<object, Map<Theme, unknown>>();

/**
 * Gives a component a StyleSheet built from the active theme. Colours resolve
 * at render, so a scheme change restyles the app without remounting it.
 */
export function useThemedStyles<T>(factory: StyleFactory<T>): T {
  const theme = useTheme();

  let byTheme = cache.get(factory);
  if (!byTheme) {
    byTheme = new Map<Theme, unknown>();
    cache.set(factory, byTheme);
  }

  let styles = byTheme.get(theme);
  if (!styles) {
    styles = factory(theme);
    byTheme.set(theme, styles);
  }

  return styles as T;
}
