import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import type { Theme } from '@/shared/theme/tokens';

const circle = (theme: Theme, diameter: number): ViewStyle => ({
  width: diameter,
  height: diameter,
  borderRadius: theme.radius.pill,
  backgroundColor: theme.colors.surface,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
});

const initials = (theme: Theme, fontSize: number): TextStyle => ({
  color: theme.colors.textMuted,
  fontSize,
  fontWeight: theme.fontWeight.medium,
});

export const createAvatarStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    circleSm: circle(theme, theme.avatarSize.sm),
    circleMd: circle(theme, theme.avatarSize.md),
    circleLg: circle(theme, theme.avatarSize.lg),
    initialsSm: initials(theme, theme.fontSize.footnote),
    initialsMd: initials(theme, theme.fontSize.title),
    initialsLg: initials(theme, theme.fontSize.heading),
    image: {
      width: '100%',
      height: '100%',
    },
  });

  return {
    image: styles.image,
    circle: { sm: styles.circleSm, md: styles.circleMd, lg: styles.circleLg },
    initials: { sm: styles.initialsSm, md: styles.initialsMd, lg: styles.initialsLg },
  };
};
