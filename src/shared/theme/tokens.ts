import type { TextStyle } from 'react-native';

/**
 * The single source of colour, spacing, radius and type in the app. Every
 * StyleSheet reads from here, so a value that is not on a scale below does not
 * belong in a component.
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

export const fontSize = {
  caption: 12,
  footnote: 13,
  body: 15,
  subtitle: 17,
  title: 20,
  heading: 28,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const satisfies Record<string, TextStyle['fontWeight']>;

/**
 * Semantic colour roles rather than named hues, so a screen asks for
 * `textMuted` and gets the right answer in either scheme.
 */
export type ThemeColors = {
  background: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  text: string;
  textMuted: string;
  textInverse: string;
  accent: string;
  accentSubtle: string;
  danger: string;
};

const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F5F6F8',
  surfaceMuted: '#E8EAEE',
  border: '#E1E4E8',
  text: '#12141A',
  textMuted: '#6B7280',
  textInverse: '#FFFFFF',
  accent: '#2F6FED',
  accentSubtle: '#E7EEFD',
  danger: '#D92D20',
};

const darkColors: ThemeColors = {
  background: '#0E1116',
  surface: '#171B22',
  surfaceMuted: '#232833',
  border: '#262B34',
  text: '#F2F4F7',
  textMuted: '#98A2B3',
  textInverse: '#0E1116',
  accent: '#5B8DEF',
  accentSubtle: '#1B2536',
  danger: '#F97066',
};

export type ColorScheme = 'light' | 'dark';

export type Theme = {
  scheme: ColorScheme;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
};

/**
 * Module-level constants. Identity is stable per scheme, which is what
 * lets themed styles be cached instead of rebuilt on every render.
 */
export const themes: Record<ColorScheme, Theme> = {
  light: { scheme: 'light', colors: lightColors, spacing, radius, fontSize, fontWeight },
  dark: { scheme: 'dark', colors: darkColors, spacing, radius, fontSize, fontWeight },
};
