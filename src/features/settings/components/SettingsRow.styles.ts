import { StyleSheet, type TextStyle } from 'react-native';
import type { Theme } from '@/shared/theme/tokens';

const MIN_TOUCH_TARGET = 44;

export const createSettingsRowStyles = (theme: Theme) => {
  const value: TextStyle = {
    flexShrink: 1,
    marginLeft: theme.spacing.md,
    fontSize: theme.fontSize.body,
    textAlign: 'right',
  };

  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: MIN_TOUCH_TARGET,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    rowPressed: {
      backgroundColor: theme.colors.surfaceMuted,
    },
    label: {
      color: theme.colors.text,
      fontSize: theme.fontSize.body,
    },
    value: { ...value, color: theme.colors.textMuted },
    linkValue: { ...value, color: theme.colors.accent },
  });
};
