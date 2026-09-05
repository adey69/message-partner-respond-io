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
 * Avatars appear at three fixed sizes — beside a name in a list, inline in the
 * chat header, and as the subject of the profile screen.
 */
export const avatarSize = {
  sm: 32,
  md: 56,
  lg: 96,
} as const;

/**
 * Semantic colour roles rather than named hues, so a screen asks for
 * `textMuted` and gets the right answer in either scheme.
 *
 * `surface` is the raised-but-quiet fill: search fields, incoming bubbles,
 * avatar placeholders. `surfaceMuted` is the pressed or selected state of one.
 * `textInverse` is text sitting on `accent`, which is white in both schemes
 * because the accent stays a saturated blue in both.
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
  surface: '#F0F2F5',
  surfaceMuted: '#E4E6EB',
  border: '#CED0D4',
  text: '#050505',
  textMuted: '#65676B',
  textInverse: '#FFFFFF',
  accent: '#0084FF',
  accentSubtle: '#E7F3FF',
  danger: '#FA383E',
};

const darkColors: ThemeColors = {
  background: '#18191A',
  surface: '#242526',
  surfaceMuted: '#3A3B3C',
  border: '#3E4042',
  text: '#E4E6EB',
  textMuted: '#B0B3B8',
  textInverse: '#FFFFFF',
  accent: '#2D88FF',
  accentSubtle: '#263951',
  danger: '#FF5C64',
};

export type ColorScheme = 'light' | 'dark';

export type Theme = {
  scheme: ColorScheme;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
  avatarSize: typeof avatarSize;
};

/**
 * Module-level constants. Identity is stable per scheme, which is what
 * lets themed styles be cached instead of rebuilt on every render.
 */
export const themes: Record<ColorScheme, Theme> = {
  light: {
    scheme: 'light',
    colors: lightColors,
    spacing,
    radius,
    fontSize,
    fontWeight,
    avatarSize,
  },
  dark: {
    scheme: 'dark',
    colors: darkColors,
    spacing,
    radius,
    fontSize,
    fontWeight,
    avatarSize,
  },
};
