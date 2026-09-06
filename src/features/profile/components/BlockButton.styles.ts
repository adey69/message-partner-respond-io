import { StyleSheet, type TextStyle } from 'react-native';
import type { Theme } from '@/shared/theme/tokens';

const MIN_TOUCH_TARGET = 44;

export const createBlockButtonStyles = (theme: Theme) => {
  const label: TextStyle = {
    fontSize: theme.fontSize.body,
    fontWeight: theme.fontWeight.semibold,
  };

  return StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.lg,
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: MIN_TOUCH_TARGET,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
    },
    buttonPressed: {
      backgroundColor: theme.colors.surfaceMuted,
    },
    blockLabel: { ...label, color: theme.colors.danger },
    unblockLabel: { ...label, color: theme.colors.accent },
    note: {
      marginTop: theme.spacing.md,
      color: theme.colors.textMuted,
      fontSize: theme.fontSize.footnote,
      textAlign: 'center',
    },
  });
};
